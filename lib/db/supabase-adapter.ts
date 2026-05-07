/**
 * Supabase DataAdapter — drop-in replacement for localAdapter.
 *
 * Uses the Supabase REST API directly (no SDK dependency).
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.
 *
 * All collections store data as JSONB columns (id TEXT, data JSONB, created_at TIMESTAMPTZ).
 * Run supabase-migration.sql in your Supabase SQL editor before switching.
 *
 * To activate: set the two env vars above. lib/db/index.ts auto-detects and switches.
 */

import type { DataAdapter } from "./adapter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function headers() {
  return {
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function base(collection: string) {
  return `${SUPABASE_URL}/rest/v1/${collection}`;
}

async function sbFetch<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[supabase] ${res.status} ${url}: ${body}`);
  }
  const text = await res.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text) as T;
}

/**
 * Supabase returns rows shaped as { id, data, created_at }.
 * We flatten `data` back into a top-level object with `id`.
 */
function flatten<T>(row: { id: string; data: Record<string, unknown> }): T {
  return { id: row.id, ...row.data } as unknown as T;
}

export const supabaseAdapter: DataAdapter = {
  async list<T>(collection: string): Promise<T[]> {
    const rows = await sbFetch<{ id: string; data: Record<string, unknown> }[]>(
      `${base(collection)}?select=id,data&order=created_at.desc`,
      { method: "GET" },
    );
    return rows.map((r) => flatten<T>(r));
  },

  async get<T>(collection: string, id: string): Promise<T | null> {
    const rows = await sbFetch<{ id: string; data: Record<string, unknown> }[]>(
      `${base(collection)}?id=eq.${encodeURIComponent(id)}&select=id,data`,
      { method: "GET" },
    );
    if (!rows.length) return null;
    return flatten<T>(rows[0]);
  },

  async create<T extends { id: string }>(collection: string, item: T): Promise<T> {
    const { id, ...rest } = item;
    const rows = await sbFetch<{ id: string; data: Record<string, unknown> }[]>(
      base(collection),
      {
        method: "POST",
        body: JSON.stringify({ id, data: rest }),
      },
    );
    return flatten<T>(rows[0]);
  },

  async update<T extends { id: string }>(
    collection: string,
    id: string,
    patch: Partial<T>,
  ): Promise<T> {
    // Fetch existing data first, merge patch into it
    const existing = await supabaseAdapter.get<T>(collection, id);
    if (!existing) throw new Error(`[supabase] ${collection}/${id} not found`);
    const { id: _id, ...rest } = { ...existing, ...patch } as T & { id: string };
    const rows = await sbFetch<{ id: string; data: Record<string, unknown> }[]>(
      `${base(collection)}?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ data: rest }),
      },
    );
    return flatten<T>(rows[0]);
  },

  async remove(collection: string, id: string): Promise<void> {
    await sbFetch<unknown>(
      `${base(collection)}?id=eq.${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },

  async clear(collection: string): Promise<void> {
    await sbFetch<unknown>(
      `${base(collection)}?id=not.is.null`,
      { method: "DELETE" },
    );
  },
};
