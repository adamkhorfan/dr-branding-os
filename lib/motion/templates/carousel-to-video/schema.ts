import type { CarouselToVideoProps } from "../../types";

export const DEFAULT_CAROUSEL_PROPS: CarouselToVideoProps = {
  slides: [
    { title: "Cover Slide", body: "Your carousel topic", slideNumber: 1 },
    { title: "Point One", body: "Explain your first key insight here.", slideNumber: 2 },
    { title: "Point Two", body: "Your second supporting point.", slideNumber: 3 },
    { title: "Take Action", body: "DM us to get started.", slideNumber: 4 },
  ],
  brandColor: "#c9a96e",
  accentColor: "#c9a96e",
  textColor: "#ffffff",
  fontFamily: "Inter, Helvetica Neue, sans-serif",
  clientName: undefined,
  framesPerSlide: 90,
};

export const CAROUSEL_FPS = 30;
