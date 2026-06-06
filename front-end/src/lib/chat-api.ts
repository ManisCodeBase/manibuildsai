const MAX_HISTORY = 10;

function getChatEndpoint(): string {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  // Local dev — call the Functions host directly (cross-origin, CORS handled by CorsMiddleware)
  if (
    backend &&
    typeof globalThis.window !== "undefined" &&
    (globalThis.window.location.hostname === "localhost" ||
      globalThis.window.location.hostname === "127.0.0.1")
  ) {
    return `${backend}/api/chat`;
  }

  // Production — same-origin via SWA rewrite in staticwebapp.config.json (no browser CORS)
  return "/api/chat";
}

export interface ChatApiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiResponse {
  role: "assistant";
  content: string;
}

export interface ChatApiError {
  error: string;
}

export async function sendChatMessages(
  messages: ChatApiMessage[]
): Promise<string> {
  const payload = {
    messages: messages.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(getChatEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: ChatApiResponse | ChatApiError;
  try {
    data = (await response.json()) as ChatApiResponse | ChatApiError;
  } catch {
    throw new Error(
      response.status === 405
        ? "Chat API proxy is not configured. Redeploy the front-end with the updated staticwebapp.config.json."
        : response.status === 404
          ? "Chat API not found. Deploy the Function App and verify the SWA /api rewrite rule."
          : "Failed to get a response. Please try again."
    );
  }

  if (!response.ok) {
    const message = "error" in data ? data.error : "Failed to get a response. Please try again.";
    throw new Error(message);
  }

  if (!("content" in data) || !data.content.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  return data.content;
}
