"use client";

import { Player } from "@remotion/player";
import type { TemplateKey } from "../types";
import { getTemplate } from "../registry";
import { BrandIntroComposition } from "../templates/brand-intro/Composition";
import { TextAnimationComposition } from "../templates/text-animation/Composition";
import { CarouselToVideoComposition } from "../templates/carousel-to-video/Composition";
import { PromoVideoComposition } from "../templates/promo-video/Composition";
import { ReportVideoComposition } from "../templates/report-video/Composition";

const COMPOSITION_MAP: Record<TemplateKey, React.ComponentType<unknown>> = {
  "brand-intro": BrandIntroComposition as React.ComponentType<unknown>,
  "text-animation": TextAnimationComposition as React.ComponentType<unknown>,
  "carousel-to-video": CarouselToVideoComposition as React.ComponentType<unknown>,
  "promo-video": PromoVideoComposition as React.ComponentType<unknown>,
  "report-video": ReportVideoComposition as React.ComponentType<unknown>,
};

interface PlayerShellProps {
  templateKey: TemplateKey;
  inputProps?: Record<string, unknown>;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  style?: React.CSSProperties;
}

export function PlayerShell({
  templateKey,
  inputProps,
  controls = true,
  loop = true,
  autoPlay = false,
  style,
}: PlayerShellProps) {
  const entry = getTemplate(templateKey);
  const Component = COMPOSITION_MAP[templateKey];

  const mergedProps = { ...entry.defaultProps, ...inputProps };

  // Compute carousel duration dynamically if framesPerSlide or slides change
  let durationInFrames = entry.durationInFrames;
  if (templateKey === "carousel-to-video") {
    const slides = (mergedProps.slides as unknown[]) ?? [];
    const framesPerSlide = (mergedProps.framesPerSlide as number) ?? 90;
    durationInFrames = Math.max(slides.length * framesPerSlide, 30);
  }

  return (
    <Player
      component={Component}
      inputProps={mergedProps}
      durationInFrames={durationInFrames}
      fps={entry.fps}
      compositionWidth={entry.width}
      compositionHeight={entry.height}
      controls={controls}
      loop={loop}
      autoPlay={autoPlay}
      style={{
        width: "100%",
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
