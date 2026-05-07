/**
 * DataAdapter — abstract persistence layer.
 *
 * Milestone 1 ships LocalAdapter (localStorage). Future milestones swap to
 * Supabase by implementing this same interface. UI never imports an adapter
 * directly — it goes through repos in /lib/db/repos/*.
 */
export interface DataAdapter {
  list<T>(collection: string): Promise<T[]>;
  get<T>(collection: string, id: string): Promise<T | null>;
  create<T extends { id: string }>(collection: string, item: T): Promise<T>;
  update<T extends { id: string }>(
    collection: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T>;
  remove(collection: string, id: string): Promise<void>;
  clear(collection: string): Promise<void>;
}

export const COLLECTIONS = {
  clients: "clients",
  workflowInstances: "workflow_instances",
  contentItems: "content_items",
  campaigns: "campaigns",
  reports: "reports",
  messages: "messages",
  n8nFlows: "n8n_flows",
} as const;
