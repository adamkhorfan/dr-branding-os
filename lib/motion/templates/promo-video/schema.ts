import type { PromoVideoProps } from "../../types";

export const DEFAULT_PROMO_PROPS: PromoVideoProps = {
  headline: "Your Brand. Your Story.",
  subheadline: "Premium quality, delivered.",
  bodyText: "We help brands grow through strategic content and authentic storytelling.",
  cta: "Get Started →",
  primaryColor: "#c9a96e",
  secondaryColor: "#111111",
  textColor: "#ffffff",
  logoUrl: undefined,
  fontFamily: "Inter, Helvetica Neue, sans-serif",
};

export const PROMO_DURATION_FRAMES = 180; // 6s at 30fps
export const PROMO_FPS = 30;
