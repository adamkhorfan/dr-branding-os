import path from "path";

/**
 * Lazily bundles the standalone Remotion project on first render request.
 * The bundle is cached in memory for the lifetime of the server process.
 *
 * Entry point: <repo-root>/../remotion/src/index.ts
 * Output:      public/remotion-bundle/
 */

let cachedBundlePath: string | null = null;
let bundling: Promise<string> | null = null;

export async function getRemotionBundle(): Promise<string> {
  // Return cached bundle if available
  if (cachedBundlePath) return cachedBundlePath;

  // If a bundle is already in progress, wait for it
  if (bundling) return bundling;

  bundling = (async () => {
    // Dynamic import — @remotion/bundler is Node-only and large, so we keep it
    // out of the module graph until actually needed.
    const { bundle } = await import("@remotion/bundler");

    // Entry point is the standalone remotion project (no @/ aliases)
    const entryPoint = path.resolve(
      process.cwd(),
      "..",
      "remotion",
      "src",
      "index.ts",
    );

    // Bundle output lands in public/ so Next.js serves it statically
    const outDir = path.resolve(process.cwd(), "public", "remotion-bundle");

    console.log("[remotion] Bundling compositions…", { entryPoint, outDir });

    const bundlePath = await bundle({
      entryPoint,
      outDir,
      // Silence verbose output
      onProgress: (progress) => {
        if (progress % 20 === 0) {
          console.log(`[remotion] Bundle progress: ${progress}%`);
        }
      },
    });

    console.log("[remotion] Bundle ready at:", bundlePath);
    cachedBundlePath = bundlePath;
    bundling = null;
    return bundlePath;
  })();

  return bundling;
}

/** Call this to invalidate the cached bundle (e.g. after templates change) */
export function invalidateBundle() {
  cachedBundlePath = null;
  bundling = null;
}
