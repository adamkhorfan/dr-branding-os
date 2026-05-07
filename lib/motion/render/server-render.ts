import type { RenderJob } from "../types";

export interface ServerRenderResult {
  artifactUrl: string;
  durationMs: number;
}

/**
 * Server-side render stub.
 *
 * Returns a mock result in dev / when @remotion/renderer is not installed.
 * To enable real rendering later:
 *   1. npm install @remotion/renderer
 *   2. npx remotion bundle  → set REMOTION_SERVE_URL in .env.local
 *   3. Replace this file with the real implementation using renderMedia()
 */
export async function serverRender(job: RenderJob): Promise<ServerRenderResult> {
  // Simulate render delay so the UI feels real
  await new Promise((r) => setTimeout(r, 1200));

  return {
    artifactUrl: `/api/motion/mock-artifact/${job.id}.mp4`,
    durationMs: 1200,
  };
}
