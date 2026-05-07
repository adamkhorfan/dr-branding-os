import { localAdapter } from "./local-adapter";
import { supabaseAdapter } from "./supabase-adapter";
import type { DataAdapter } from "./adapter";

/**
 * Single source of truth for which adapter the repos use.
 *
 * AUTO-SWITCH: When NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
 * are both present in .env.local, Supabase is used automatically.
 * Otherwise falls back to localStorage.
 *
 * To migrate:
 * 1. Run lib/db/supabase-migration.sql in your Supabase SQL editor.
 * 2. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.
 * 3. Restart the dev server. Done.
 */
const hasSupabase =
  typeof process !== "undefined" &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const db: DataAdapter = hasSupabase ? supabaseAdapter : localAdapter;

export * from "./adapter";
