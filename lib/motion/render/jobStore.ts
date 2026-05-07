/**
 * In-memory render job store.
 * Lives in the Node.js process — fine for single-server / local dev.
 * For multi-instance production: swap with Redis or a DB table.
 */

export interface RenderJobEntry {
  state: "rendering" | "done" | "error";
  progress: number;
  artifactUrl?: string;
  durationMs?: number;
  error?: string;
}

// Module-level singleton — survives across API requests within a process
const store = new Map<string, RenderJobEntry>();

export const renderJobStore = {
  set(id: string, entry: RenderJobEntry) {
    store.set(id, entry);
  },
  get(id: string): RenderJobEntry | undefined {
    return store.get(id);
  },
  delete(id: string) {
    store.delete(id);
  },
};
