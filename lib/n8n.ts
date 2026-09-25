export const DEFAULT_N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  "http://localhost:5678/webhook/gramodyog-chat-trigger";

export type N8NChatPayload = {
  message: string;
  sessionId: string;
  webhookUrl?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  businessName?: string;
  investment?: string;
  location?: string;
};

export async function sendChatMessageToN8N(
  payload: N8NChatPayload
): Promise<string> {
  const url = payload.webhookUrl?.trim() || DEFAULT_N8N_WEBHOOK_URL;

  // Primary: Use internal Next.js API route (/api/chat) to bypass CORS issues on localhost
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput: payload.message,
        message: payload.message,
        sessionId: payload.sessionId,
        history: payload.history || [],
        webhookUrl: url,
        businessName: payload.businessName,
        investment: payload.investment,
        location: payload.location,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        data?.error || `HTTP ${res.status}: Failed to communicate with n8n.`;
      throw new Error(errMsg);
    }

    return data?.text ?? "";
  } catch (apiErr: unknown) {
    // Secondary fallback: Direct fetch to n8n from the browser if possible
    try {
      const directRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify({
          chatInput: payload.message,
          message: payload.message,
          sessionId: payload.sessionId,
          history: payload.history || [],
          businessName: payload.businessName,
          investment: payload.investment,
          location: payload.location,
        }),
      });

      const raw = await directRes.text();
      if (!directRes.ok) {
        throw new Error(
          `n8n HTTP ${directRes.status}: ${directRes.statusText}${
            raw ? " - " + raw.slice(0, 150) : ""
          }`
        );
      }

      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "string") return parsed;
        if (parsed && typeof parsed === "object") {
          if ("output" in parsed && typeof parsed.output === "string") {
            return parsed.output;
          }
          if ("text" in parsed && typeof parsed.text === "string") {
            return parsed.text;
          }
          if ("message" in parsed && typeof parsed.message === "string") {
            return parsed.message;
          }
          if (Array.isArray(parsed) && parsed.length > 0) {
            const first = parsed[0];
            return (
              first.output ||
              first.text ||
              first.message ||
              JSON.stringify(first)
            );
          }
          return JSON.stringify(parsed, null, 2);
        }
        return String(parsed);
      } catch {
        return raw;
      }
    } catch {
      const originalMessage =
        apiErr instanceof Error ? apiErr.message : String(apiErr);
      throw new Error(originalMessage);
    }
  }
}
