using ManiBuildsAI.Functions.Http;
using ManiBuildsAI.Functions.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddSingleton<IFunctionsWorkerMiddleware, CorsMiddleware>();

        services.AddHttpClient("OpenAI", client =>
        {
            client.BaseAddress = new Uri("https://api.openai.com/");
            client.Timeout = TimeSpan.FromSeconds(60);
        });

        services.AddSingleton<DigitalTwinChatService>();
    })
    .Build();

await host.RunAsync();
