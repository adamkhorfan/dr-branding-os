import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { sent: false, message: "RESEND_API_KEY not configured. Add it to .env.local to enable email sending." },
      { status: 200 },
    );
  }

  const body = await req.json() as {
    to: string;
    subject: string;
    html: string;
    from?: string;
  };

  const { to, subject, html, from } = body;

  if (!to || !subject || !html) {
    return NextResponse.json(
      { sent: false, message: "Missing required fields: to, subject, html" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from ?? "DR Branding OS <noreply@drbranding.com>",
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json() as { id?: string; message?: string };

    if (!res.ok) {
      return NextResponse.json(
        { sent: false, message: data.message ?? "Failed to send email." },
        { status: res.status },
      );
    }

    return NextResponse.json({ sent: true, id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { sent: false, message },
      { status: 500 },
    );
  }
}
