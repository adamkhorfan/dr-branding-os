import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type { ContentItem, ContentType, Platform, ContentStatus } from "@/types/content";

const C = COLLECTIONS.contentItems;

export interface ContentItemCreateInput {
  clientId: string;
  type: ContentType;
  title: string;
  body?: string;
  platforms?: Platform[];
  tags?: string[];
  sourceWorkflowInstanceId?: string;
}

export const contentRepo = {
  async list(): Promise<ContentItem[]> {
    return db.list<ContentItem>(C);
  },

  async listByClient(clientId: string): Promise<ContentItem[]> {
    const all = await db.list<ContentItem>(C);
    return all.filter((i) => i.clientId === clientId);
  },

  async get(id: string): Promise<ContentItem | null> {
    return db.get<ContentItem>(C, id);
  },

  async create(input: ContentItemCreateInput): Promise<ContentItem> {
    const ts = nowIso();
    const item: ContentItem = {
      id: uid("ci"),
      clientId: input.clientId,
      type: input.type,
      title: input.title,
      body: input.body,
      platforms: input.platforms ?? [],
      tags: input.tags ?? [],
      status: "draft",
      sourceWorkflowInstanceId: input.sourceWorkflowInstanceId,
      createdAt: ts,
      updatedAt: ts,
    };
    return db.create<ContentItem>(C, item);
  },

  async update(id: string, patch: Partial<ContentItem>): Promise<ContentItem> {
    return db.update<ContentItem>(C, id, { ...patch, updatedAt: nowIso() });
  },

  async setStatus(id: string, status: ContentStatus): Promise<ContentItem> {
    return db.update<ContentItem>(C, id, { status, updatedAt: nowIso() });
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};
