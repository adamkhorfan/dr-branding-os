import type { TemplateKey } from "./types";
import {
  DEFAULT_BRAND_INTRO_PROPS,
  BRAND_INTRO_DURATION_FRAMES,
  BRAND_INTRO_FPS,
} from "./templates/brand-intro/schema";
import {
  DEFAULT_TEXT_ANIMATION_PROPS,
  TEXT_ANIMATION_DURATION_FRAMES,
  TEXT_ANIMATION_FPS,
} from "./templates/text-animation/schema";
import {
  DEFAULT_CAROUSEL_PROPS,
  CAROUSEL_FPS,
} from "./templates/carousel-to-video/schema";
import {
  DEFAULT_PROMO_PROPS,
  PROMO_DURATION_FRAMES,
  PROMO_FPS,
} from "./templates/promo-video/schema";
import {
  DEFAULT_REPORT_PROPS,
  REPORT_DURATION_FRAMES,
  REPORT_FPS,
} from "./templates/report-video/schema";

export interface TemplateRegistryEntry {
  key: TemplateKey;
  label: string;
  description: string;
  compositionId: string;
  defaultProps: Record<string, unknown>;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

export const TEMPLATE_REGISTRY: Record<TemplateKey, TemplateRegistryEntry> = {
  "brand-intro": {
    key: "brand-intro",
    label: "Brand Intro",
    description: "Cinematic logo reveal with brand colors and tagline.",
    compositionId: "BrandIntro",
    defaultProps: DEFAULT_BRAND_INTRO_PROPS as Record<string, unknown>,
    durationInFrames: BRAND_INTRO_DURATION_FRAMES,
    fps: BRAND_INTRO_FPS,
    width: 1080,
    height: 1080,
  },
  "text-animation": {
    key: "text-animation",
    label: "Text Animation",
    description: "Animated typography for quotes, headlines, and statements.",
    compositionId: "TextAnimation",
    defaultProps: DEFAULT_TEXT_ANIMATION_PROPS as Record<string, unknown>,
    durationInFrames: TEXT_ANIMATION_DURATION_FRAMES,
    fps: TEXT_ANIMATION_FPS,
    width: 1080,
    height: 1080,
  },
  "carousel-to-video": {
    key: "carousel-to-video",
    label: "Carousel to Video",
    description: "Convert carousel slides into a sequential video.",
    compositionId: "CarouselToVideo",
    defaultProps: DEFAULT_CAROUSEL_PROPS as Record<string, unknown>,
    durationInFrames:
      DEFAULT_CAROUSEL_PROPS.slides.length * DEFAULT_CAROUSEL_PROPS.framesPerSlide,
    fps: CAROUSEL_FPS,
    width: 1080,
    height: 1080,
  },
  "promo-video": {
    key: "promo-video",
    label: "Promo Video",
    description: "High-impact promotional video with animated CTA.",
    compositionId: "PromoVideo",
    defaultProps: DEFAULT_PROMO_PROPS as Record<string, unknown>,
    durationInFrames: PROMO_DURATION_FRAMES,
    fps: PROMO_FPS,
    width: 1920,
    height: 1080,
  },
  "report-video": {
    key: "report-video",
    label: "Report Video",
    description: "Monthly KPI report with animated counters and highlights.",
    compositionId: "ReportVideo",
    defaultProps: DEFAULT_REPORT_PROPS as Record<string, unknown>,
    durationInFrames: REPORT_DURATION_FRAMES,
    fps: REPORT_FPS,
    width: 1920,
    height: 1080,
  },
};

export const ALL_TEMPLATE_KEYS = Object.keys(TEMPLATE_REGISTRY) as TemplateKey[];

export function getTemplate(key: TemplateKey): TemplateRegistryEntry {
  return TEMPLATE_REGISTRY[key];
}
