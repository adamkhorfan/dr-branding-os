import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type { Report } from "@/types/report";

const C = COLLECTIONS.reports;

export const reportRepo = {
  async list(): Promise<Report[]> {
    return db.list<Report>(C);
  },

  async listByClient(clientId: string): Promise<Report[]> {
    const all = await db.list<Report>(C);
    return all.filter((r) => r.clientId === clientId);
  },

  async get(id: string): Promise<Report | null> {
    return db.get<Report>(C, id);
  },

  async upsert(report: Omit<Report, "id" | "createdAt" | "updatedAt" | "generatedAt">): Promise<Report> {
    const all = await db.list<Report>(C);
    const existing = all.find(
      (r) => r.clientId === report.clientId && r.month === report.month,
    );
    const ts = nowIso();
    if (existing) {
      return db.update<Report>(C, existing.id, { ...report, generatedAt: ts, updatedAt: ts });
    }
    const full: Report = {
      id: uid("rep"),
      ...report,
      generatedAt: ts,
      createdAt: ts,
      updatedAt: ts,
    };
    return db.create<Report>(C, full);
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};
