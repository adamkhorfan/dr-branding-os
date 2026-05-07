// This file is used by the Remotion CLI only — not by Next.js.
// Type assertions below are intentional to satisfy Remotion's LooseComponentType.
import { Composition } from "remotion";
import { BrandIntroComposition } from "./templates/brand-intro/Composition";
import { TextAnimationComposition } from "./templates/text-animation/Composition";
import { CarouselToVideoComposition } from "./templates/carousel-to-video/Composition";
import { PromoVideoComposition } from "./templates/promo-video/Composition";
import { ReportVideoComposition } from "./templates/report-video/Composition";

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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandIntro"
        component={BrandIntroComposition as any}
        durationInFrames={BRAND_INTRO_DURATION_FRAMES}
        fps={BRAND_INTRO_FPS}
        width={1080}
        height={1080}
        defaultProps={DEFAULT_BRAND_INTRO_PROPS}
      />

      <Composition
        id="TextAnimation"
        component={TextAnimationComposition as any}
        durationInFrames={TEXT_ANIMATION_DURATION_FRAMES}
        fps={TEXT_ANIMATION_FPS}
        width={1080}
        height={1080}
        defaultProps={DEFAULT_TEXT_ANIMATION_PROPS}
      />

      <Composition
        id="CarouselToVideo"
        component={CarouselToVideoComposition as any}
        durationInFrames={
          DEFAULT_CAROUSEL_PROPS.slides.length * DEFAULT_CAROUSEL_PROPS.framesPerSlide
        }
        fps={CAROUSEL_FPS}
        width={1080}
        height={1080}
        defaultProps={DEFAULT_CAROUSEL_PROPS}
      />

      <Composition
        id="PromoVideo"
        component={PromoVideoComposition as any}
        durationInFrames={PROMO_DURATION_FRAMES}
        fps={PROMO_FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROMO_PROPS}
      />

      <Composition
        id="ReportVideo"
        component={ReportVideoComposition as any}
        durationInFrames={REPORT_DURATION_FRAMES}
        fps={REPORT_FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_REPORT_PROPS}
      />
    </>
  );
};
