/**
 * Server-side render orchestration.
 *
 * In production, this calls @remotion/renderer (bundle + renderMedia).
 * In dev / when renderer is not installed, it returns a mock result so the
 * UI can be developed and tested without a full Remotion render setup.
 *
 * To enable real rendering:
 *   npm install @remotion/renderer
 *   Set REMOTION_SERVE_URL in your environment (from `npx remotion bundle`)
 */

import type { RenderJob } from "../types";

export interface ServerRenderResult {
  artifactUrl: string;
  durationMs: number;
}

export async function serverRender(job: RenderJob): Promise<ServerRenderResult> {
  const serveUrl = process.env.REMOTION_SERVE_URL;

  if (!serveUrl) {
    // Dev fallback — simulate a render so the UI still works
    await new Promise((r) => setTimeout(r, 1200));
    return {
      artifactUrl: `/api/motion/mock-artifact/${job.id}.mp4`,
      durationMs: 1200,
    };
  }

  // Real render path (requires @remotion/renderer installed)
  // Dynamically import so the app still builds without the package
  try {
    const { renderMedia, selectComposition } = await import("@remotion/renderer" as string as never) as {
      renderMedia: Function;
      selectComposition: Function;
    };

    const start = Date.now();

    const composition = await selectComposition({
      serveUrl,
      id: job.templateKey
        .split("-")
        .map((w: string) => w[0].toUpperCase() + w.slice(1))
        .join(""),
      inputProps: job.props,
    });

    const outputPath = `/tmp/drb-render-${job.id}.${job.output.format}`;

    await renderMedia({
      composition,
      serveUrl,
      codec: job.output.format === "gif" ? "gif" : "h264",
      outputLocation: outputPath,
      inputProps: job.props,
    });

    return {
      artifactUrl: outputPath,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    throw new Error(`Render failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
