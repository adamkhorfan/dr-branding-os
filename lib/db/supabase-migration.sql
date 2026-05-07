-- ============================================================
-- DR Branding OS — Supabase Migration
-- Run this entire file in your Supabase SQL editor.
-- ============================================================
-- All tables use a flat schema: id (TEXT PK) + data (JSONB) + created_at.
-- This matches the localStorage adapter pattern exactly, making the swap seamless.
-- ============================================================

-- Enable pgcrypto for UUID generation (usually already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Clients ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS clients_created_at ON clients (created_at DESC);

-- ─── Workflow Instances ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_instances (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS workflow_instances_created_at ON workflow_instances (created_at DESC);
CREATE INDEX IF NOT EXISTS workflow_instances_client ON workflow_instances ((data->>'clientId'));

-- ─── Content Items ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_items (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS content_items_created_at ON content_items (created_at DESC);
CREATE INDEX IF NOT EXISTS content_items_client ON content_items ((data->>'clientId'));
CREATE INDEX IF NOT EXISTS content_items_status ON content_items ((data->>'status'));

-- ─── Campaigns ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS campaigns_created_at ON campaigns (created_at DESC);
CREATE INDEX IF NOT EXISTS campaigns_client ON campaigns ((data->>'clientId'));

-- ─── Reports ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reports_created_at ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_client ON reports ((data->>'clientId'));
CREATE INDEX IF NOT EXISTS reports_month ON reports ((data->>'month'));

-- ─── Messages (Threads) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_created_at ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_client ON messages ((data->>'clientId'));

-- ─── n8n Flows ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS n8n_flows (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS n8n_flows_created_at ON n8n_flows (created_at DESC);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Enable RLS on all tables. Adjust policies to match your auth setup.
-- For a single-user workspace, "allow all for authenticated users" is fine.

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_flows ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (single-workspace setup)
-- Replace with more granular policies if you add multi-user support.
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'clients', 'workflow_instances', 'content_items',
    'campaigns', 'reports', 'messages', 'n8n_flows'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format(
      'CREATE POLICY IF NOT EXISTS "auth_all_%s" ON %I
       FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl, tbl
    );
  END LOOP;
END $$;

-- ─── Done ────────────────────────────────────────────────────────────────────
-- After running this, add to your .env.local:
--
--   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
--
-- Restart the dev server. The app will auto-switch to Supabase.
-- ============================================================
