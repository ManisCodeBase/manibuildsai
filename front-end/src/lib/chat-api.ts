const MAX_HISTORY = 10;

function getChatEndpoint(): string {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (backend && typeof globalThis.window !== "undefined" && globalThis.window.location.hostname === "localhost") {
    return `${backend}/api/chat`;
  }
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

  const data = (await response.json()) as ChatApiResponse | ChatApiError;

  if (!response.ok) {
    const message = "error" in data ? data.error : "Failed to get a response. Please try again.";
    throw new Error(message);
  }

  if (!("content" in data) || !data.content.trim()) {
    throw new Error("The AI returned an empty response.");
  }

  return data.content;
}
