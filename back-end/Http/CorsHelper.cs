using Microsoft.Azure.Functions.Worker.Http;

namespace ManiBuildsAI.Functions.Http;

internal static class CorsHelper
{
    private const string AllowMethods = "GET, POST, OPTIONS";
    private const string AllowHeaders = "Content-Type, Accept, Authorization, X-Requested-With";
    private const string MaxAge = "86400";

    public static void AddCorsHeaders(HttpResponseData res, HttpRequestData? req = null)
    {
        var configured = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS") ?? "*";
        var allowedOrigins = configured == "*"
            ? Array.Empty<string>()
            : configured.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        string? requestOrigin = null;
        if (req?.Headers.TryGetValues("Origin", out var origins) == true)
            requestOrigin = origins.FirstOrDefault();

        string? allowOrigin = null;
        if (configured == "*")
        {
            allowOrigin = "*";
        }
        else if (requestOrigin != null && allowedOrigins.Contains(requestOrigin, StringComparer.OrdinalIgnoreCase))
        {
            allowOrigin = requestOrigin;
        }
        else if (allowedOrigins.Length > 0)
        {
            allowOrigin = allowedOrigins[0];
        }

        if (allowOrigin != null)
            SetHeader(res, "Access-Control-Allow-Origin", allowOrigin);

        SetHeader(res, "Access-Control-Allow-Methods", AllowMethods);
        SetHeader(res, "Access-Control-Allow-Headers", AllowHeaders);
        SetHeader(res, "Access-Control-Max-Age", MaxAge);

        if (allowOrigin != null && allowOrigin != "*")
            SetHeader(res, "Vary", "Origin");
    }

    public static bool IsPreflight(HttpRequestData req) =>
        req.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase) &&
        req.Headers.Contains("Access-Control-Request-Method");

    private static void SetHeader(HttpResponseData res, string name, string value)
    {
        if (!res.Headers.TryAddWithoutValidation(name, value))
            res.Headers.Remove(name);
        res.Headers.TryAddWithoutValidation(name, value);
    }
}
