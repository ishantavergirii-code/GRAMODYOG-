import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const webhookUrl =
      body.webhookUrl?.trim() ||
      process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
      "http://localhost:5678/webhook/gramodyog-chat-trigger";

    const messageText = body.chatInput || body.message || "";
    const sessionId = body.sessionId || `session_${Date.now()}`;
    const history = body.history || [];

    const payload = {
      chatInput: messageText,
      message: messageText,
      sessionId,
      history,
      businessName: body.businessName,
      investment: body.investment,
      location: body.location,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for n8n AI agent

    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        fetchErr instanceof Error && fetchErr.name === "AbortError";
      const message = isAbort
        ? "Request timed out after 60 seconds."
        : fetchErr instanceof Error
        ? fetchErr.message
        : String(fetchErr);

      return NextResponse.json(
        {
          error: `Could not connect to n8n webhook at ${webhookUrl}: ${message}`,
          details:
            "Make sure your n8n instance is running, the workflow is Active (or 'Listen for test event' is clicked), and the webhook URL is reachable.",
        },
        { status: 502 }
      );
    }

    clearTimeout(timeoutId);
    const rawText = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `n8n HTTP Error ${res.status}: ${res.statusText}${
            rawText ? " - " + rawText.slice(0, 300) : ""
          }`,
        },
        { status: res.status }
      );
    }

    let aiResponse = "";
    try {
      const data = JSON.parse(rawText);
      if (typeof data === "string") {
        aiResponse = data;
      } else if (data && typeof data === "object") {
        if ("output" in data && typeof data.output === "string") {
          aiResponse = data.output;
        } else if ("text" in data && typeof data.text === "string") {
          aiResponse = data.text;
        } else if ("message" in data && typeof data.message === "string") {
          aiResponse = data.message;
        } else if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          if (typeof first === "string") {
            aiResponse = first;
          } else if (first && typeof first === "object") {
            aiResponse =
              first.output ||
              first.text ||
              first.message ||
              JSON.stringify(first);
          } else {
            aiResponse = JSON.stringify(first);
          }
        } else {
          aiResponse = JSON.stringify(data, null, 2);
        }
      } else {
        aiResponse = String(data);
      }
    } catch {
      // Plain text or HTML from n8n
      aiResponse = rawText;
    }

    return NextResponse.json({
      text: aiResponse,
      status: "ok",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: `Server error: ${msg}`,
      },
      { status: 500 }
    );
  }
}
