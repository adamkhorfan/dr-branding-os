import type { ID, ISODate, Status, Timestamps } from "./common";

// ─── Brand Kit ─────────────────────────────────────────────────────────

export type BrandColorRole =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "support";

export interface BrandColor {
  hex: string;
  name?: string;
  role?: BrandColorRole;
}

export interface BrandKit {
  // Identity
  logoUrl?: string;
  logoNotes?: string;

  // Color
  palette: BrandColor[];

  // Typography
  typographyPrimary?: string;
  typographySecondary?: string;
  typographyNotes?: string;

  // Voice + style
  toneOfVoice?: string;
  visualStyle?: string;

  // Content rules
  contentDos: string[];
  contentDonts: string[];

  // Language
  preferredLanguage?: string;

  // Brand positioning (used by Remotion templates as context for captions/scripts)
  positioningStatement?: string;

  // Audience emotions — drives tone for video/content generation
  audienceEmotions: string[];
}

// ─── Brief (positioning + offers) ──────────────────────────────────────

export interface ClientBrief {
  positioning?: string;
  offers: string[];
}

// ─── Goals + audience ──────────────────────────────────────────────────

export interface ClientGoals {
  goals: string[];
  audience?: string;
  audienceEmotions: string[];
}

// ─── Competitors ───────────────────────────────────────────────────────

export interface Competitor {
  id: ID;
  name: string;
  url?: string;
  notes?: string;
}

// ─── Socials + contacts (carried over from M1) ─────────────────────────

export interface ClientSocials {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
  linkedin?: string;
  x?: string;
}

export interface ClientContact {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

// ─── History ───────────────────────────────────────────────────────────

export type HistoryEntryKind =
  | "created"
  | "profile-updated"
  | "brand-kit-updated"
  | "brief-updated"
  | "goals-updated"
  | "competitors-updated"
  | "notes-updated"
  | "archived"
  | "restored";

export interface HistoryEntry {
  id: ID;
  at: ISODate;
  kind: HistoryEntryKind;
  message: string;
}

// ─── Client root ───────────────────────────────────────────────────────

export interface Client extends Timestamps {
  id: ID;
  name: string;
  slug: string;
  industry?: string;
  status: Status;
  brandKit: BrandKit;
  brief: ClientBrief;
  goals: ClientGoals;
  competitors: Competitor[];
  socials: ClientSocials;
  contacts: ClientContact[];
  notes?: string;
  history: HistoryEntry[];
}

// ─── Inputs ────────────────────────────────────────────────────────────

export type ClientCreateInput = {
  name: string;
  industry?: string;
  status?: Status;
  // Optional seed values for the create dialog
  positioning?: string;
  audience?: string;
  notes?: string;
};

export type ClientUpdateInput = Partial<
  Omit<Client, "id" | "createdAt" | "updatedAt" | "history">
>;

// Empty constructors used by the repo
export const EMPTY_BRAND_KIT: BrandKit = {
  palette: [],
  contentDos: [],
  contentDonts: [],
  audienceEmotions: [],
};

export const EMPTY_BRIEF: ClientBrief = {
  offers: [],
};

export const EMPTY_GOALS: ClientGoals = {
  goals: [],
  audienceEmotions: [],
};
