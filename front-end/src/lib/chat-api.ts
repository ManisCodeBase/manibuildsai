const MAX_HISTORY = 10;

const FUNCTION_APP_URL =
  "https://digitaltwin-c8hahfg9b6ctbeg2.canadacentral-01.azurewebsites.net";

function getChatEndpoint(): string {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  if (backend) {
    return `${backend}/api/chat`;
  }

  // Fallback when SWA is not linked to the Function App (POST /api/chat on SWA returns 405)
  if (typeof globalThis.window !== "undefined") {
    return `${FUNCTION_APP_URL}/api/chat`;
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

  let data: ChatApiResponse | ChatApiError;
  try {
    data = (await response.json()) as ChatApiResponse | ChatApiError;
  } catch {
    throw new Error(
      response.status === 405
        ? "Chat API is unavailable. Ensure the Azure Function App is deployed and NEXT_PUBLIC_BACKEND_URL is set."
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
