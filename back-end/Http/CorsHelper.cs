using Microsoft.Azure.Functions.Worker.Http;

namespace ManiBuildsAI.Functions.Http;

internal static class CorsHelper
{
    public static void AddCorsHeaders(HttpResponseData res, HttpRequestData? req = null)
    {
        var configured = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "*";
        var allowedOrigins = configured == "*"
            ? []
            : configured.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        string? requestOrigin = null;
        if (req?.Headers.TryGetValues("Origin", out var origins) == true)
            requestOrigin = origins.FirstOrDefault();

        if (configured == "*")
        {
            res.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        else if (requestOrigin != null && allowedOrigins.Contains(requestOrigin, StringComparer.OrdinalIgnoreCase))
        {
            res.Headers.Add("Access-Control-Allow-Origin", requestOrigin);
        }
        else if (allowedOrigins.Length > 0)
        {
            res.Headers.Add("Access-Control-Allow-Origin", allowedOrigins[0]);
        }

        res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
    }
}
