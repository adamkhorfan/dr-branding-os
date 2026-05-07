import type { BrandKit } from "@/types/client";
import type { ReportKpi } from "@/types/report";

// ─── Template keys ────────────────────────────────────────────────────────────

export type TemplateKey =
  | "brand-intro"
  | "text-animation"
  | "carousel-to-video"
  | "promo-video"
  | "report-video";

// ─── Per-template prop schemas ────────────────────────────────────────────────

export interface BrandIntroProps {
  companyName: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
}

export interface TextAnimationProps {
  text: string;
  subtext?: string;
  animationStyle: "fade" | "slide-up" | "stagger" | "mask" | "kinetic";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  duration: number; // frames
}

export interface CarouselSlide {
  title: string;
  body?: string;
  slideNumber?: number;
}

export interface CarouselToVideoProps {
  slides: CarouselSlide[];
  brandColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
  clientName?: string;
  framesPerSlide: number;
}

export interface PromoVideoProps {
  headline: string;
  subheadline?: string;
  bodyText?: string;
  cta: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  logoUrl?: string;
  fontFamily: string;
}

export interface ReportVideoProps {
  clientName: string;
  month: string; // e.g. "May 2026"
  kpis: ReportKpi[];
  highlights: string[];
  primaryColor: string;
  accentColor: string;
  textColor: string;
  fontFamily: string;
}

// Union of all template props
export type TemplateProps =
  | BrandIntroProps
  | TextAnimationProps
  | CarouselToVideoProps
  | PromoVideoProps
  | ReportVideoProps;

// ─── Render job ───────────────────────────────────────────────────────────────

export type RenderFormat = "mp4" | "webm" | "gif";
export type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";

export interface RenderOutputSpec {
  format: RenderFormat;
  aspectRatio: AspectRatio;
  fps: number;
}

export interface RenderJob {
  id: string;
  templateKey: TemplateKey;
  clientId: string;
  props: TemplateProps;
  output: RenderOutputSpec;
  createdAt: string;
}

// ─── Render status ────────────────────────────────────────────────────────────

export type RenderStatusState =
  | "queued"
  | "rendering"
  | "done"
  | "error";

export interface RenderStatus {
  jobId: string;
  state: RenderStatusState;
  progress: number; // 0–100
  artifactUrl?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

// TemplateRegistryEntry is defined in registry.ts (the authoritative shape)
