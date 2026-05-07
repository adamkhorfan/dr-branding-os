import type { DataAdapter } from "./adapter";

const KEY_PREFIX = "drb:";

function readAll<T>(collection: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + collection);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeAll<T>(collection: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY_PREFIX + collection, JSON.stringify(items));
}

export const localAdapter: DataAdapter = {
  async list<T>(collection: string): Promise<T[]> {
    return readAll<T>(collection);
  },

  async get<T>(collection: string, id: string): Promise<T | null> {
    const items = readAll<{ id: string } & T>(collection);
    return (items.find((i) => i.id === id) as T | undefined) ?? null;
  },

  async create<T extends { id: string }>(
    collection: string,
    item: T,
  ): Promise<T> {
    const items = readAll<T>(collection);
    items.unshift(item);
    writeAll(collection, items);
    return item;
  },

  async update<T extends { id: string }>(
    collection: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T> {
    const items = readAll<T>(collection);
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) throw new Error(`[localAdapter] ${collection}/${id} not found`);
    const updated = { ...items[idx], ...patch } as T;
    items[idx] = updated;
    writeAll(collection, items);
    return updated;
  },

  async remove(collection: string, id: string): Promise<void> {
    const items = readAll<{ id: string }>(collection);
    writeAll(
      collection,
      items.filter((i) => i.id !== id),
    );
  },

  async clear(collection: string): Promise<void> {
    writeAll(collection, []);
  },
};
