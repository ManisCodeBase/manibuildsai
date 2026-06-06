using System.Net;
using System.Reflection;
using System.Text;
using ManiBuildsAI.Functions.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace ManiBuildsAI.Functions.Functions;

public class SwaggerFunction
{
    private static readonly string OpenApiJson = BuildOpenApiJson();

    [Function("Health")]
    public async Task<HttpResponseData> HealthAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "health")]
        HttpRequestData req)
    {
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return await JsonResponse(req, HttpStatusCode.OK, new { status = "ok" });

        return await JsonResponse(req, HttpStatusCode.OK, new
        {
            status = "healthy",
            service = "ManiBuildsAI.Functions",
            version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0",
            endpoints = new[] { "/api/health", "/api/swagger", "/api/docs", "/api/chat", "/api/contact" },
        });
    }

    [Function("Swagger")]
    public async Task<HttpResponseData> SwaggerAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "swagger")]
        HttpRequestData req)
    {
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return await TextResponse(req, HttpStatusCode.OK, "application/json", "{}");

        return await TextResponse(req, HttpStatusCode.OK, "application/json", OpenApiJson);
    }

    [Function("ApiDocs")]
    public async Task<HttpResponseData> DocsAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "docs")]
        HttpRequestData req)
    {
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return await TextResponse(req, HttpStatusCode.OK, "text/html", string.Empty);

        return await TextResponse(req, HttpStatusCode.OK, "text/html; charset=utf-8", DocsHtml);
    }

    private static async Task<HttpResponseData> JsonResponse(HttpRequestData req, HttpStatusCode status, object payload)
    {
        var res = req.CreateResponse(status);
        CorsHelper.AddCorsHeaders(res, req);
        await res.WriteAsJsonAsync(payload);
        return res;
    }

    private static async Task<HttpResponseData> TextResponse(
        HttpRequestData req, HttpStatusCode status, string contentType, string body)
    {
        var res = req.CreateResponse(status);
        CorsHelper.AddCorsHeaders(res, req);
        res.Headers.Add("Content-Type", contentType);
        await res.WriteStringAsync(body, Encoding.UTF8);
        return res;
    }

    private static string BuildOpenApiJson() =>
        """
        {
          "openapi": "3.0.3",
          "info": {
            "title": "manibuildsai.com API",
            "description": "Digital Twin chat and contact endpoints for manibuildsai.com",
            "version": "1.0.0"
          },
          "servers": [{ "url": "/api" }],
          "paths": {
            "/health": {
              "get": {
                "summary": "Health check",
                "responses": { "200": { "description": "Service is healthy" } }
              }
            },
            "/chat": {
              "post": {
                "summary": "Digital Twin chat",
                "requestBody": {
                  "required": true,
                  "content": {
                    "application/json": {
                      "schema": {
                        "type": "object",
                        "required": ["messages"],
                        "properties": {
                          "messages": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "required": ["role", "content"],
                              "properties": {
                                "role": { "type": "string", "enum": ["user", "assistant"] },
                                "content": { "type": "string", "maxLength": 500 }
                              }
                            }
                          }
                        }
                      },
                      "example": {
                        "messages": [{ "role": "user", "content": "What AI projects has Mani built?" }]
                      }
                    }
                  }
                },
                "responses": {
                  "200": { "description": "Assistant reply" },
                  "400": { "description": "Invalid request" },
                  "503": { "description": "OpenAI not configured or unavailable" }
                }
              }
            },
            "/contact": {
              "post": {
                "summary": "Contact form submission",
                "responses": {
                  "200": { "description": "Message sent" },
                  "400": { "description": "Validation error" }
                }
              }
            }
          }
        }
        """;

    private const string DocsHtml = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>manibuildsai.com API Docs</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; color: #111; }
            h1 { font-size: 1.6rem; }
            h2 { margin-top: 2rem; font-size: 1.1rem; border-bottom: 1px solid #ddd; padding-bottom: .3rem; }
            code, pre { background: #f4f4f5; border-radius: 6px; }
            code { padding: .1rem .35rem; }
            pre { padding: 1rem; overflow-x: auto; }
            button { background: #2563eb; color: #fff; border: 0; border-radius: 6px; padding: .55rem 1rem; cursor: pointer; }
            button:disabled { opacity: .6; cursor: wait; }
            textarea { width: 100%; min-height: 120px; font-family: ui-monospace, monospace; margin: .5rem 0; }
            .result { white-space: pre-wrap; background: #0f172a; color: #e2e8f0; padding: 1rem; border-radius: 6px; min-height: 3rem; }
            .muted { color: #64748b; font-size: .9rem; }
          </style>
        </head>
        <body>
          <h1>manibuildsai.com API</h1>
          <p class="muted">OpenAPI: <a href="/api/swagger">/api/swagger</a> · Health: <a href="/api/health">/api/health</a></p>

          <h2>GET /api/health</h2>
          <button type="button" id="btn-health">Test health</button>
          <pre class="result" id="health-result">Click "Test health"</pre>

          <h2>POST /api/chat</h2>
          <p>Digital Twin — ask about Mani's experience, projects, and skills.</p>
          <textarea id="chat-body">{
          "messages": [
            { "role": "user", "content": "What AI projects has Mani built?" }
          ]
        }</textarea>
          <button type="button" id="btn-chat">Send chat request</button>
          <pre class="result" id="chat-result">Click "Send chat request"</pre>

          <h2>POST /api/contact</h2>
          <textarea id="contact-body">{
          "name": "Test User",
          "email": "test@example.com",
          "subject": "other",
          "message": "Test message from API docs page."
        }</textarea>
          <button type="button" id="btn-contact">Send contact request</button>
          <pre class="result" id="contact-result">Click "Send contact request"</pre>

          <script>
            async function callApi(path, method, body, resultId, buttonId) {
              const result = document.getElementById(resultId);
              const button = document.getElementById(buttonId);
              result.textContent = "Loading...";
              button.disabled = true;
              try {
                const options = { method, headers: { "Content-Type": "application/json" } };
                if (body) options.body = body;
                const response = await fetch(path, options);
                const text = await response.text();
                result.textContent = response.status + " " + response.statusText + "\\n\\n" + text;
              } catch (error) {
                result.textContent = "Error: " + error.message;
              } finally {
                button.disabled = false;
              }
            }

            document.getElementById("btn-health").addEventListener("click", () =>
              callApi("/api/health", "GET", null, "health-result", "btn-health"));

            document.getElementById("btn-chat").addEventListener("click", () =>
              callApi("/api/chat", "POST", document.getElementById("chat-body").value, "chat-result", "btn-chat"));

            document.getElementById("btn-contact").addEventListener("click", () =>
              callApi("/api/contact", "POST", document.getElementById("contact-body").value, "contact-result", "btn-contact"));
          </script>
        </body>
        </html>
        """;
}
