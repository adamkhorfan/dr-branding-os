import type { RenderJob, RenderStatus } from "../types";

const JOBS_KEY = "drb:render_jobs";
const STATUS_KEY = "drb:render_status";

function readMap<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}

function writeMap<T>(key: string, map: Record<string, T>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(map));
}

export const renderQueue = {
  enqueue(job: RenderJob): void {
    const jobs = readMap<RenderJob>(JOBS_KEY);
    jobs[job.id] = job;
    writeMap(JOBS_KEY, jobs);

    const statuses = readMap<RenderStatus>(STATUS_KEY);
    statuses[job.id] = {
      jobId: job.id,
      state: "queued",
      progress: 0,
      startedAt: new Date().toISOString(),
    };
    writeMap(STATUS_KEY, statuses);
  },

  getJob(jobId: string): RenderJob | null {
    return readMap<RenderJob>(JOBS_KEY)[jobId] ?? null;
  },

  getStatus(jobId: string): RenderStatus | null {
    return readMap<RenderStatus>(STATUS_KEY)[jobId] ?? null;
  },

  updateStatus(jobId: string, patch: Partial<RenderStatus>): void {
    const statuses = readMap<RenderStatus>(STATUS_KEY);
    if (!statuses[jobId]) return;
    statuses[jobId] = { ...statuses[jobId], ...patch };
    writeMap(STATUS_KEY, statuses);
  },

  listJobs(): RenderJob[] {
    return Object.values(readMap<RenderJob>(JOBS_KEY)).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  listStatuses(): RenderStatus[] {
    return Object.values(readMap<RenderStatus>(STATUS_KEY));
  },

  remove(jobId: string): void {
    const jobs = readMap<RenderJob>(JOBS_KEY);
    const statuses = readMap<RenderStatus>(STATUS_KEY);
    delete jobs[jobId];
    delete statuses[jobId];
    writeMap(JOBS_KEY, jobs);
    writeMap(STATUS_KEY, statuses);
  },
};
