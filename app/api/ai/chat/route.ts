import { NextRequest, NextResponse } from "next/server";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // Return a graceful mock response when no API key is configured
    return NextResponse.json({
      text: "AI is not configured yet — add ANTHROPIC_API_KEY to .env.local to enable the assistant.",
    });
  }

  const body = await req.json();
  const {
    messages,
    context,
    maxTokens = 2048,
  } = body as {
    messages: IncomingMessage[];
    context?: string;
    maxTokens?: number;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const systemPrompt = [
    "You are the AI Command Center for DR Branding OS — a marketing agency operating system.",
    "You are Adam's personal assistant with full context of the agency's clients, campaigns, workflows, and content.",
    "Be concise, strategic, and actionable. When referencing clients or data, use the provided context snapshot.",
    "Format responses with markdown when helpful (bullet points, bold, headers). Keep answers focused and professional.",
    context ? `\n\n## Current Agency Context\n${context}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const text = (data.content?.[0]?.text ?? "") as string;
  return NextResponse.json({ text });
}
