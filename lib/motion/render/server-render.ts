import path from "path";
import fs from "fs";
import type { RenderJob } from "../types";
import { getRemotionBundle } from "./bundler";
import { TEMPLATE_REGISTRY } from "../registry";

export interface ServerRenderResult {
  artifactUrl: string;
  durationMs: number;
}

/**
 * Renders a Remotion composition to an MP4 file using @remotion/renderer.
 *
 * Output: public/renders/<jobId>.mp4  → served at /renders/<jobId>.mp4
 *
 * First render: bundles the compositions (~20-40s). Subsequent renders reuse
 * the cached bundle and only take as long as the actual render (seconds).
 */
export async function serverRender(job: RenderJob): Promise<ServerRenderResult> {
  const start = Date.now();

  // Ensure output directory exists
  const rendersDir = path.resolve(process.cwd(), "public", "renders");
  if (!fs.existsSync(rendersDir)) {
    fs.mkdirSync(rendersDir, { recursive: true });
  }

  const outputLocation = path.join(rendersDir, `${job.id}.mp4`);

  // Get the composition metadata from our registry
  const templateMeta = TEMPLATE_REGISTRY[job.templateKey];
  if (!templateMeta) {
    throw new Error(`Unknown templateKey: ${job.templateKey}`);
  }

  // Get or build the bundle
  const serveUrl = await getRemotionBundle();

  // Dynamic import — keep @remotion/renderer out of the cold-start path
  const { renderMedia, selectComposition } = await import("@remotion/renderer");

  const inputProps = job.props as unknown as Record<string, unknown>;

  // Resolve the composition with our input props
  const composition = await selectComposition({
    serveUrl,
    id: templateMeta.compositionId,
    inputProps,
  });

  // Render to MP4
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation,
    inputProps,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct % 10 === 0) {
        console.log(`[remotion] Rendering ${job.templateKey} — ${pct}%`);
      }
    },
  });

  const durationMs = Date.now() - start;
  console.log(`[remotion] Render complete in ${durationMs}ms → ${outputLocation}`);

  return {
    artifactUrl: `/renders/${job.id}.mp4`,
    durationMs,
  };
}
