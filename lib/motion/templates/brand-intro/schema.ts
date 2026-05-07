import type { BrandIntroProps } from "../../types";

export const DEFAULT_BRAND_INTRO_PROPS: BrandIntroProps = {
  companyName: "Your Brand",
  tagline: "Positioning statement goes here",
  logoUrl: undefined,
  primaryColor: "#c9a96e",
  secondaryColor: "#111111",
  textColor: "#ffffff",
  fontFamily: "Inter, Helvetica Neue, sans-serif",
};

export const BRAND_INTRO_DURATION_FRAMES = 150; // 5s at 30fps
export const BRAND_INTRO_FPS = 30;
