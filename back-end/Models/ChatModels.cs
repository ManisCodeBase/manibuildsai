using System.Text.Json.Serialization;

namespace ManiBuildsAI.Functions.Models;

public sealed record ChatRequest(
    [property: JsonPropertyName("messages")] List<ChatMessageDto> Messages);

public sealed record ChatMessageDto(
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("content")] string Content);

public sealed record ChatResponse(
    [property: JsonPropertyName("role")] string Role,
    [property: JsonPropertyName("content")] string Content);

public sealed record ChatErrorResponse(
    [property: JsonPropertyName("error")] string Error);
