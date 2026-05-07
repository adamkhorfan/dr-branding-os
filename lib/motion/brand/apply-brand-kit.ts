/**
 * Maps a Client's BrandKit to strongly-typed template props.
 * This is the single bridge between the client data model and the render layer.
 */

import type { BrandKit } from "@/types/client";
import type {
  BrandIntroProps,
  TextAnimationProps,
  CarouselToVideoProps,
  PromoVideoProps,
  ReportVideoProps,
} from "../types";
import type { ReportKpi } from "@/types/report";

function primaryColor(kit: BrandKit): string {
  return (
    kit.palette.find((p) => p.role === "primary")?.hex ??
    kit.palette[0]?.hex ??
    "#c9a96e"
  );
}

function secondaryColor(kit: BrandKit): string {
  return (
    kit.palette.find((p) => p.role === "secondary")?.hex ??
    kit.palette[1]?.hex ??
    "#1a1a1a"
  );
}

function accentColor(kit: BrandKit): string {
  return (
    kit.palette.find((p) => p.role === "accent")?.hex ??
    kit.palette[2]?.hex ??
    "#c9a96e"
  );
}

function textColor(kit: BrandKit): string {
  // If primary is dark, use white text; if light, use dark text.
  const hex = secondaryColor(kit).replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#111111" : "#ffffff";
}

function fontFamily(kit: BrandKit): string {
  return kit.typographyPrimary ?? "Inter, Helvetica Neue, sans-serif";
}

export function toBrandIntroProps(
  kit: BrandKit,
  companyName: string,
): BrandIntroProps {
  return {
    companyName,
    tagline: kit.positioningStatement?.slice(0, 60),
    logoUrl: kit.logoUrl,
    primaryColor: primaryColor(kit),
    secondaryColor: secondaryColor(kit),
    textColor: textColor(kit),
    fontFamily: fontFamily(kit),
  };
}

export function toTextAnimationProps(
  kit: BrandKit,
  text: string,
): TextAnimationProps {
  return {
    text,
    animationStyle: "fade",
    backgroundColor: primaryColor(kit),
    textColor: "#ffffff",
    accentColor: accentColor(kit),
    fontFamily: fontFamily(kit),
    duration: 90,
  };
}

export function toCarouselToVideoProps(
  kit: BrandKit,
  slides: { title: string; body?: string }[],
  clientName?: string,
): CarouselToVideoProps {
  return {
    slides: slides.map((s, i) => ({ ...s, slideNumber: i + 1 })),
    brandColor: primaryColor(kit),
    accentColor: accentColor(kit),
    textColor: "#ffffff",
    fontFamily: fontFamily(kit),
    clientName,
    framesPerSlide: 90,
  };
}

export function toPromoVideoProps(
  kit: BrandKit,
  headline: string,
  cta: string,
): PromoVideoProps {
  return {
    headline,
    cta,
    primaryColor: primaryColor(kit),
    secondaryColor: secondaryColor(kit),
    textColor: "#ffffff",
    logoUrl: kit.logoUrl,
    fontFamily: fontFamily(kit),
  };
}

export function toReportVideoProps(
  kit: BrandKit,
  clientName: string,
  month: string,
  kpis: ReportKpi[],
  highlights: string[],
): ReportVideoProps {
  return {
    clientName,
    month,
    kpis,
    highlights,
    primaryColor: primaryColor(kit),
    accentColor: accentColor(kit),
    textColor: "#ffffff",
    fontFamily: fontFamily(kit),
  };
}
