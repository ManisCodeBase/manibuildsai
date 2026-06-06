using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;

namespace ManiBuildsAI.Functions.Http;

internal sealed class CorsMiddleware : IFunctionsWorkerMiddleware
{
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var request = await context.GetHttpRequestDataAsync();
        if (request is null)
        {
            await next(context);
            return;
        }

        if (CorsHelper.IsPreflight(request))
        {
            var preflight = request.CreateResponse(System.Net.HttpStatusCode.NoContent);
            CorsHelper.AddCorsHeaders(preflight, request);
            context.GetInvocationResult().Value = preflight;
            return;
        }

        await next(context);

        var response = context.GetHttpResponseData();
        if (response is not null)
            CorsHelper.AddCorsHeaders(response, request);
    }
}
