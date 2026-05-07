"use client";

import { create } from "zustand";
import { reportRepo } from "@/lib/db/repos/reportRepo";
import type { Report } from "@/types/report";

interface ReportsState {
  reports: Report[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  save: (report: Omit<Report, "id" | "createdAt" | "updatedAt" | "generatedAt">) => Promise<Report>;
  remove: (id: string) => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  loaded: false,
  loading: false,

  async load() {
    if (get().loading) return;
    set({ loading: true });
    const reports = await reportRepo.list();
    set({ reports, loaded: true, loading: false });
  },

  async save(data) {
    const report = await reportRepo.upsert(data);
    set((s) => {
      const filtered = s.reports.filter(
        (r) => !(r.clientId === data.clientId && r.month === data.month),
      );
      return { reports: [report, ...filtered] };
    });
    return report;
  },

  async remove(id) {
    await reportRepo.remove(id);
    set((s) => ({ reports: s.reports.filter((r) => r.id !== id) }));
  },
}));
