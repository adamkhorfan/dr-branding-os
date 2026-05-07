import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, slugify, uid } from "@/lib/utils";
import type {
  BrandColor,
  Client,
  ClientCreateInput,
  ClientUpdateInput,
  HistoryEntry,
  HistoryEntryKind,
} from "@/types/client";
import {
  EMPTY_BRAND_KIT,
  EMPTY_BRIEF,
  EMPTY_GOALS,
} from "@/types/client";

const C = COLLECTIONS.clients;

// ─── Migration: legacy → current shape ──────────────────────────────────

/**
 * Coerce client objects written by older builds into the current shape.
 * Safe to run on already-current clients.
 */
function migrate(raw: unknown): Client {
  const r = (raw ?? {}) as Record<string, any>;
  const rawBk = (r.brandKit ?? {}) as Record<string, any>;
  const rawBrief = (r.brief ?? {}) as Record<string, any>;
  const rawGoals = (r.goals ?? {}) as Record<string, any>;

  // palette: legacy was string[], new is BrandColor[]
  let palette: BrandColor[] = [];
  if (Array.isArray(rawBk.palette)) {
    palette = rawBk.palette.map((p: unknown): BrandColor => {
      if (typeof p === "string") return { hex: p };
      if (p && typeof p === "object" && "hex" in (p as object)) {
        return p as BrandColor;
      }
      return { hex: "#000000" };
    });
  }

  // typography: legacy stored as fonts: string[], new is split fields
  const legacyFonts: string[] = Array.isArray(rawBk.fonts) ? rawBk.fonts : [];

  // tone of voice: legacy "voiceNotes" maps to new "toneOfVoice"
  const toneOfVoice: string | undefined =
    rawBk.toneOfVoice ?? rawBk.voiceNotes ?? undefined;

  return {
    id: r.id,
    name: r.name ?? "Untitled client",
    slug: r.slug ?? slugify(r.name ?? "untitled"),
    industry: r.industry,
    status: r.status ?? "active",
    createdAt: r.createdAt ?? nowIso(),
    updatedAt: r.updatedAt ?? nowIso(),

    brandKit: {
      logoUrl: rawBk.logoUrl,
      logoNotes: rawBk.logoNotes,
      palette,
      typographyPrimary:
        rawBk.typographyPrimary ?? legacyFonts[0] ?? undefined,
      typographySecondary:
        rawBk.typographySecondary ?? legacyFonts[1] ?? undefined,
      typographyNotes: rawBk.typographyNotes,
      toneOfVoice,
      visualStyle: rawBk.visualStyle,
      contentDos: Array.isArray(rawBk.contentDos) ? rawBk.contentDos : [],
      contentDonts: Array.isArray(rawBk.contentDonts) ? rawBk.contentDonts : [],
      preferredLanguage: rawBk.preferredLanguage,
      positioningStatement: rawBk.positioningStatement,
      audienceEmotions: Array.isArray(rawBk.audienceEmotions)
        ? rawBk.audienceEmotions
        : [],
    },

    brief: {
      positioning: rawBrief.positioning,
      offers: Array.isArray(rawBrief.offers) ? rawBrief.offers : [],
    },

    goals: {
      goals:
        Array.isArray(rawGoals.goals)
          ? rawGoals.goals
          : Array.isArray(rawBrief.goals)
            ? rawBrief.goals
            : [],
      audience: rawGoals.audience ?? rawBrief.audience,
      audienceEmotions: Array.isArray(rawGoals.audienceEmotions)
        ? rawGoals.audienceEmotions
        : [],
    },

    competitors: Array.isArray(r.competitors) ? r.competitors : [],

    socials: r.socials ?? {},
    contacts: Array.isArray(r.contacts) ? r.contacts : [],
    notes: r.notes,
    history: Array.isArray(r.history) ? r.history : [],
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────

function makeHistoryEntry(
  kind: HistoryEntryKind,
  message: string,
): HistoryEntry {
  return {
    id: uid("h"),
    at: nowIso(),
    kind,
    message,
  };
}

const HISTORY_LIMIT = 50;

function appendHistory(
  existing: HistoryEntry[] | undefined,
  entry: HistoryEntry,
): HistoryEntry[] {
  const list = [entry, ...(existing ?? [])];
  return list.slice(0, HISTORY_LIMIT);
}

function emptyClient(input: ClientCreateInput): Client {
  const ts = nowIso();
  return {
    id: uid("cli"),
    slug: slugify(input.name),
    name: input.name,
    industry: input.industry,
    status: input.status ?? "active",
    brandKit: { ...EMPTY_BRAND_KIT },
    brief: { ...EMPTY_BRIEF, positioning: input.positioning },
    goals: { ...EMPTY_GOALS, audience: input.audience },
    competitors: [],
    socials: {},
    contacts: [],
    notes: input.notes,
    history: [makeHistoryEntry("created", `Client created`)],
    createdAt: ts,
    updatedAt: ts,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────

export const clientRepo = {
  async list(): Promise<Client[]> {
    const raw = await db.list<unknown>(C);
    return raw.map(migrate);
  },

  async get(id: string): Promise<Client | null> {
    const raw = await db.get<unknown>(C, id);
    return raw ? migrate(raw) : null;
  },

  async create(input: ClientCreateInput): Promise<Client> {
    const c = emptyClient(input);
    await db.create<Client>(C, c);
    return c;
  },

  /**
   * Update with an explicit history kind. Use the section-specific helpers
   * below in UI code; this is the underlying primitive.
   */
  async update(
    id: string,
    patch: ClientUpdateInput,
    kind: HistoryEntryKind = "profile-updated",
    message?: string,
  ): Promise<Client> {
    const current = await this.get(id);
    if (!current) throw new Error(`Client ${id} not found`);

    const entry = makeHistoryEntry(
      kind,
      message ?? defaultMessageFor(kind),
    );

    const updated: Client = {
      ...current,
      ...patch,
      brandKit: patch.brandKit ?? current.brandKit,
      brief: patch.brief ?? current.brief,
      goals: patch.goals ?? current.goals,
      competitors: patch.competitors ?? current.competitors,
      socials: patch.socials ?? current.socials,
      contacts: patch.contacts ?? current.contacts,
      slug: patch.name ? slugify(patch.name) : current.slug,
      history: appendHistory(current.history, entry),
      updatedAt: nowIso(),
    };

    await db.update<Client>(C, id, updated);
    return updated;
  },

  // Section-specific updaters — preferred call sites in UI

  updateProfile(
    id: string,
    patch: Pick<ClientUpdateInput, "name" | "industry">,
  ) {
    return this.update(id, patch, "profile-updated", "Profile updated");
  },

  updateBrandKit(id: string, brandKit: Client["brandKit"]) {
    return this.update(id, { brandKit }, "brand-kit-updated", "Brand kit updated");
  },

  updateBrief(id: string, brief: Client["brief"]) {
    return this.update(id, { brief }, "brief-updated", "Brief updated");
  },

  updateGoals(id: string, goals: Client["goals"]) {
    return this.update(id, { goals }, "goals-updated", "Goals & audience updated");
  },

  updateCompetitors(id: string, competitors: Client["competitors"]) {
    return this.update(
      id,
      { competitors },
      "competitors-updated",
      "Competitors updated",
    );
  },

  updateNotes(id: string, notes: string) {
    return this.update(id, { notes }, "notes-updated", "Notes updated");
  },

  async archive(id: string): Promise<Client> {
    return this.update(id, { status: "archived" }, "archived", "Client archived");
  },

  async restore(id: string): Promise<Client> {
    return this.update(id, { status: "active" }, "restored", "Client restored");
  },

  async remove(id: string): Promise<void> {
    return db.remove(C, id);
  },
};

function defaultMessageFor(kind: HistoryEntryKind): string {
  switch (kind) {
    case "created":
      return "Client created";
    case "profile-updated":
      return "Profile updated";
    case "brand-kit-updated":
      return "Brand kit updated";
    case "brief-updated":
      return "Brief updated";
    case "goals-updated":
      return "Goals & audience updated";
    case "competitors-updated":
      return "Competitors updated";
    case "notes-updated":
      return "Notes updated";
    case "archived":
      return "Client archived";
    case "restored":
      return "Client restored";
  }
}
