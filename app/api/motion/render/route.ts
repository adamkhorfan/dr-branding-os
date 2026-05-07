import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { RenderJob } from "@/lib/motion/types";
import { serverRender } from "@/lib/motion/render/server-render";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateKey, clientId, props, output } = body as Partial<RenderJob>;

    if (!templateKey || !props) {
      return NextResponse.json({ error: "templateKey and props are required" }, { status: 400 });
    }

    const job: RenderJob = {
      id: randomUUID(),
      templateKey,
      clientId: clientId ?? "unknown",
      props,
      output: output ?? { format: "mp4", aspectRatio: "16:9", fps: 30 },
      createdAt: new Date().toISOString(),
    };

    // Fire-and-forget — client polls /api/motion/status/[jobId]
    // For simplicity in dev, we run inline (blocking) and return the result
    const result = await serverRender(job);

    return NextResponse.json({
      jobId: job.id,
      state: "done",
      progress: 100,
      artifactUrl: result.artifactUrl,
      durationMs: result.durationMs,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
