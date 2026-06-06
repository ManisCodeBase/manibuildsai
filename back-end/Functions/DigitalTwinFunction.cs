using System.Net;
using ManiBuildsAI.Functions.Http;
using ManiBuildsAI.Functions.Models;
using ManiBuildsAI.Functions.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace ManiBuildsAI.Functions.Functions;

public class DigitalTwinFunction(
    DigitalTwinChatService chatService,
    ILogger<DigitalTwinFunction> logger)
{
    [Function("DigitalTwin")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "chat")]
        HttpRequestData req)
    {
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
            return CorsResponse(req, HttpStatusCode.OK);

        ChatRequest? body;
        try
        {
            body = await req.ReadFromJsonAsync<ChatRequest>();
        }
        catch
        {
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new ChatErrorResponse("Invalid request body."));
        }

        if (body?.Messages is null || body.Messages.Count == 0)
        {
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new ChatErrorResponse("At least one message is required."));
        }

        IReadOnlyList<(string Role, string Content)> history;
        try
        {
            history = DigitalTwinChatService.ValidateAndTrimHistory(
                body.Messages.Select(m => (m.Role, m.Content)));
        }
        catch (ArgumentException ex)
        {
            return await JsonResponse(req, HttpStatusCode.BadRequest,
                new ChatErrorResponse(ex.Message));
        }

        try
        {
            var reply = await chatService.GetReplyAsync(history);
            logger.LogInformation("Digital Twin chat request completed");
            return await JsonResponse(req, HttpStatusCode.OK,
                new ChatResponse("assistant", reply));
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Digital Twin chat failed");
            return await JsonResponse(req, HttpStatusCode.ServiceUnavailable,
                new ChatErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected Digital Twin error");
            return await JsonResponse(req, HttpStatusCode.InternalServerError,
                new ChatErrorResponse("Something went wrong. Please try again."));
        }
    }

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
}
