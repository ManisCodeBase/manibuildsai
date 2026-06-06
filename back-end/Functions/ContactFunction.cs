using System.Net;
using System.Text.RegularExpressions;
using ManiBuildsAI.Functions.Http;
using ManiBuildsAI.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace ManiBuildsAI.Functions.Functions;

public class ContactFunction(ILogger<ContactFunction> logger)
{
    private static readonly Dictionary<string, string> SubjectLabels = new()
    {
        ["consulting"]    = "AI Engineering Consulting",
        ["fulltime"]      = "Full-time Opportunity",
        ["collaboration"] = "Open Source / Collaboration",
        ["speaking"]      = "Speaking / Workshops",
        ["other"]         = "Other",
    };

    [Function("Contact")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "contact")]
        HttpRequestData req)
    {
        // ── CORS preflight ────────────────────────────────────────────────
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return CorsResponse(req, HttpStatusCode.OK);

        // ── Parse body ────────────────────────────────────────────────────
        ContactFormData? form;
        try
        {
            form = await req.ReadFromJsonAsync<ContactFormData>();
        }
        catch
        {
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new { error = "Invalid request body." });
        }

        if (form is null ||
            string.IsNullOrWhiteSpace(form.Name)    ||
            string.IsNullOrWhiteSpace(form.Email)   ||
            string.IsNullOrWhiteSpace(form.Subject) ||
            string.IsNullOrWhiteSpace(form.Message))
        {
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new { error = "All fields are required." });
        }

        if (!IsValidEmail(form.Email))
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new { error = "Invalid email address." });

        var cleanName    = Sanitize(form.Name);
        var cleanMessage = Sanitize(form.Message);
        var cleanSubject = Sanitize(form.Subject);

        if (cleanName.Length < 2 || cleanMessage.Length < 10)
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new { error = "Invalid submission." });

        // ── Send via SendGrid ─────────────────────────────────────────────
        var apiKey      = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
        var toEmail     = Environment.GetEnvironmentVariable("CONTACT_EMAIL")       ?? "mani.ainml@gmail.com";
        var fromEmail   = Environment.GetEnvironmentVariable("SENDGRID_FROM_EMAIL") ?? "noreply@mani.dev";
        var subjectLabel = SubjectLabels.GetValueOrDefault(cleanSubject, cleanSubject);

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            logger.LogWarning("SENDGRID_API_KEY not configured — email not sent");
            return await JsonResponse(req, HttpStatusCode.InternalServerError,
                new { error = "Email service not configured on the server." });
        }

        var client = new SendGridClient(apiKey);
        var msg = new SendGridMessage
        {
            From           = new EmailAddress(fromEmail, "manibuildsai.com"),
            Subject        = $"[manibuildsai.com] {subjectLabel} — from {cleanName}",
            HtmlContent    = BuildHtml(cleanName, form.Email, subjectLabel, cleanMessage),
            PlainTextContent = $"From: {cleanName} <{form.Email}>\nTopic: {subjectLabel}\n\n{cleanMessage}",
        };
        msg.AddTo(new EmailAddress(toEmail));
        msg.SetReplyTo(new EmailAddress(form.Email, cleanName));

        var sgResponse = await client.SendEmailAsync(msg);

        if (!sgResponse.IsSuccessStatusCode)
        {
            var body = await sgResponse.Body.ReadAsStringAsync();
            logger.LogError("SendGrid error {Status}: {Body}", sgResponse.StatusCode, body);
            return await JsonResponse(req, HttpStatusCode.InternalServerError,
                new { error = "Failed to send message. Please try again." });
        }

        logger.LogInformation("Contact email sent from {Email} ({Name})", form.Email, cleanName);
        return await JsonResponse(req, HttpStatusCode.OK,
            new { success = true, message = "Message sent successfully." });
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private static HttpResponseData CorsResponse(HttpRequestData req, HttpStatusCode status)
    {
        var res = req.CreateResponse(status);
        AddCorsHeaders(res, req);
        return res;
    }

    private static async Task<HttpResponseData> JsonResponse(
        HttpRequestData req, HttpStatusCode status, object payload)
    {
        var res = req.CreateResponse(status);
        AddCorsHeaders(res, req);
        await res.WriteAsJsonAsync(payload);
        return res;
    }

    private static void AddCorsHeaders(HttpResponseData res, HttpRequestData req) =>
        CorsHelper.AddCorsHeaders(res, req);

    private static bool IsValidEmail(string email) =>
        Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$");

    private static string Sanitize(string input) =>
        Regex.Replace(input, "<[^>]*>", "").Trim()[..Math.Min(input.Length, 2000)];

    private static string BuildHtml(string name, string email, string subject, string message) => $"""
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0f;color:#fff;padding:32px;border-radius:16px;border:1px solid #1a1a2e;">
          <div style="margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #1a1a2e;">
            <h1 style="color:#00d4ff;font-size:20px;margin:0 0 4px;">New Contact Form Submission</h1>
            <p style="color:#666;font-size:13px;margin:0;">via manibuildsai.com</p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;width:80px;vertical-align:top;"><span style="color:#7c3aed;font-weight:600;font-size:13px;">From</span></td>
              <td style="padding:10px 0;"><span style="color:#fff;font-size:14px;">{name}</span> <span style="color:#888;font-size:13px;">&lt;{email}&gt;</span></td>
            </tr>
            <tr>
              <td style="padding:10px 0;vertical-align:top;"><span style="color:#7c3aed;font-weight:600;font-size:13px;">Topic</span></td>
              <td style="padding:10px 0;"><span style="background:#1a1a2e;color:#00d4ff;font-size:12px;padding:3px 10px;border-radius:20px;border:1px solid #00d4ff33;">{subject}</span></td>
            </tr>
          </table>
          <div style="margin-top:20px;">
            <p style="color:#7c3aed;font-weight:600;font-size:13px;margin:0 0 10px;">Message</p>
            <div style="background:#111827;padding:18px;border-radius:10px;border:1px solid #1f2937;color:#d1d5db;font-size:14px;line-height:1.7;white-space:pre-wrap;">{message}</div>
          </div>
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #1a1a2e;color:#444;font-size:12px;">
            Reply to this email to reach <strong style="color:#888;">{name}</strong> at {email}
          </div>
        </div>
        """;
}
