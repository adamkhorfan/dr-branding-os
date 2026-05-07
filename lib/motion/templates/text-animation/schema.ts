import type { TextAnimationProps } from "../../types";

export const DEFAULT_TEXT_ANIMATION_PROPS: TextAnimationProps = {
  text: "Your statement here.",
  subtext: undefined,
  animationStyle: "fade",
  backgroundColor: "#111111",
  textColor: "#ffffff",
  accentColor: "#c9a96e",
  fontFamily: "Inter, Helvetica Neue, sans-serif",
  duration: 90,
};

export const TEXT_ANIMATION_DURATION_FRAMES = 90; // 3s at 30fps
export const TEXT_ANIMATION_FPS = 30;
