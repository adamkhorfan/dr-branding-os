import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { RenderJob } from "@/lib/motion/types";
import { serverRender } from "@/lib/motion/render/server-render";
import { renderJobStore } from "@/lib/motion/render/jobStore";

export const maxDuration = 300; // Allow up to 5 min for long renders (Vercel Pro)

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

    // Mark job as in-progress immediately
    renderJobStore.set(job.id, { state: "rendering", progress: 0 });

    // Fire render — non-blocking so we return the jobId right away
    serverRender(job)
      .then((result) => {
        renderJobStore.set(job.id, {
          state: "done",
          progress: 100,
          artifactUrl: result.artifactUrl,
          durationMs: result.durationMs,
        });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[remotion] Render failed:", message);
        renderJobStore.set(job.id, { state: "error", progress: 0, error: message });
      });

    return NextResponse.json({ jobId: job.id, state: "rendering", progress: 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
