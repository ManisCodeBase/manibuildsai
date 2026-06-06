using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace ManiBuildsAI.Functions.Functions;

/// <summary>
/// Placeholder for the Digital Twin AI chat endpoint.
/// Replace the stub response with a real LLM call (Azure OpenAI / Semantic Kernel)
/// when ready to implement the full AI chat experience.
/// </summary>
public class DigitalTwinFunction(ILogger<DigitalTwinFunction> logger)
{
    [Function("DigitalTwin")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", "options", Route = "chat")]
        HttpRequestData req)
    {
        if (req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
        {
            var preflight = req.CreateResponse(HttpStatusCode.OK);
            AddCorsHeaders(preflight);
            return preflight;
        }

        // TODO: Parse incoming messages array and call Azure OpenAI / Semantic Kernel
        // Example structure expected from the front-end:
        // { "messages": [{ "role": "user", "content": "..." }] }

        logger.LogInformation("Digital Twin chat request received — LLM not yet wired");

        var response = req.CreateResponse(HttpStatusCode.OK);
        AddCorsHeaders(response);
        await response.WriteAsJsonAsync(new
        {
            role    = "assistant",
            content = "Hi! I'm Mani's Digital Twin. The LLM integration is coming soon. " +
                      "In the meantime, feel free to reach out directly via the contact form.",
        });

        return response;
    }

    private static void AddCorsHeaders(HttpResponseData res)
    {
        var allowed = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "*";
        res.Headers.Add("Access-Control-Allow-Origin",  allowed == "*" ? "*" : allowed.Split(',')[0]);
        res.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
    }
}
