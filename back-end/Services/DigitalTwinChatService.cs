using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;

namespace ManiBuildsAI.Functions.Services;

public sealed class DigitalTwinChatService(IHttpClientFactory httpClientFactory, ILogger<DigitalTwinChatService> logger)
{
    private const int MaxInputLength = 500;
    private const int MaxHistoryMessages = 10;
    private const int MaxOutputTokens = 600;

    private static readonly string SystemPrompt = LoadSystemPrompt();
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public async Task<string> GetReplyAsync(IReadOnlyList<(string Role, string Content)> messages, CancellationToken ct = default)
    {
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("OPENAI_API_KEY is not configured.");

        var model = Environment.GetEnvironmentVariable("OPENAI_MODEL") ?? "gpt-4o-mini";

        var payload = new OpenAiChatRequest
        {
            Model = model,
            MaxCompletionTokens = MaxOutputTokens,
            PromptCacheKey = "mani-digital-twin-v1",
            Messages =
            [
                new OpenAiMessage("system", SystemPrompt),
                ..messages.Select(m => new OpenAiMessage(NormalizeRole(m.Role), SanitizeContent(m.Content))),
            ],
        };

        var client = httpClientFactory.CreateClient("OpenAI");
        using var request = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload, JsonOptions), Encoding.UTF8, "application/json"),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        using var response = await client.SendAsync(request, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            logger.LogError("OpenAI error {Status}: {Body}", (int)response.StatusCode, body);
            throw new InvalidOperationException("The AI service returned an error. Please try again.");
        }

        var completion = JsonSerializer.Deserialize<OpenAiChatResponse>(body, JsonOptions);
        var reply = completion?.Choices?.FirstOrDefault()?.Message?.Content?.Trim();

        if (string.IsNullOrWhiteSpace(reply))
        {
            logger.LogWarning("OpenAI returned empty content: {Body}", body);
            throw new InvalidOperationException("The AI service returned an empty response.");
        }

        var cachedTokens = completion?.Usage?.PromptTokensDetails?.CachedTokens ?? 0;
        logger.LogInformation(
            "Digital Twin reply — model={Model}, prompt_tokens={PromptTokens}, cached_tokens={CachedTokens}, completion_tokens={CompletionTokens}",
            model,
            completion?.Usage?.PromptTokens ?? 0,
            cachedTokens,
            completion?.Usage?.CompletionTokens ?? 0);

        return reply;
    }

    public static IReadOnlyList<(string Role, string Content)> ValidateAndTrimHistory(
        IEnumerable<(string Role, string Content)> messages)
    {
        var valid = messages
            .Where(m => !string.IsNullOrWhiteSpace(m.Content))
            .Select(m => (Role: NormalizeRole(m.Role), Content: SanitizeContent(m.Content)))
            .Where(m => m.Role is "user" or "assistant")
            .TakeLast(MaxHistoryMessages)
            .ToList();

        if (valid.Count == 0 || valid[^1].Role != "user")
            throw new ArgumentException("At least one user message is required.");

        if (valid[^1].Content.Length > MaxInputLength)
            throw new ArgumentException($"Message must be {MaxInputLength} characters or fewer.");

        return valid;
    }

    private static string NormalizeRole(string role) =>
        role.Equals("assistant", StringComparison.OrdinalIgnoreCase) ? "assistant" : "user";

    private static string SanitizeContent(string content) =>
        content.Trim()[..Math.Min(content.Trim().Length, MaxInputLength)];

    private static string LoadSystemPrompt()
    {
        var assembly = Assembly.GetExecutingAssembly();
        const string resourceName = "ManiBuildsAI.Functions.Prompts.digital-twin-system.txt";
        using var stream = assembly.GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException($"Embedded resource not found: {resourceName}");
        using var reader = new StreamReader(stream);
        return reader.ReadToEnd();
    }

    private sealed class OpenAiChatRequest
    {
        [JsonPropertyName("model")]
        public required string Model { get; init; }

        [JsonPropertyName("messages")]
        public required List<OpenAiMessage> Messages { get; init; }

        [JsonPropertyName("max_completion_tokens")]
        public int MaxCompletionTokens { get; init; }

        [JsonPropertyName("prompt_cache_key")]
        public string? PromptCacheKey { get; init; }
    }

    private sealed record OpenAiMessage(
        [property: JsonPropertyName("role")] string Role,
        [property: JsonPropertyName("content")] string Content);

    private sealed class OpenAiChatResponse
    {
        [JsonPropertyName("choices")]
        public List<OpenAiChoice>? Choices { get; init; }

        [JsonPropertyName("usage")]
        public OpenAiUsage? Usage { get; init; }
    }

    private sealed class OpenAiChoice
    {
        [JsonPropertyName("message")]
        public OpenAiMessage? Message { get; init; }
    }

    private sealed class OpenAiUsage
    {
        [JsonPropertyName("prompt_tokens")]
        public int PromptTokens { get; init; }

        [JsonPropertyName("completion_tokens")]
        public int CompletionTokens { get; init; }

        [JsonPropertyName("prompt_tokens_details")]
        public OpenAiPromptTokenDetails? PromptTokensDetails { get; init; }
    }

    private sealed class OpenAiPromptTokenDetails
    {
        [JsonPropertyName("cached_tokens")]
        public int CachedTokens { get; init; }
    }
}
