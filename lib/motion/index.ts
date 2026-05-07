/**
 * lib/motion — Remotion render layer public API.
 *
 * All Remotion imports are confined to this folder.
 * External consumers (pages, API routes) import from here only.
 */

export type {
  TemplateKey,
  BrandIntroProps,
  TextAnimationProps,
  CarouselToVideoProps,
  PromoVideoProps,
  ReportVideoProps,
  TemplateProps,
  RenderJob,
  RenderStatus,
  RenderFormat,
  AspectRatio,
} from "./types";

export { TEMPLATE_REGISTRY, ALL_TEMPLATE_KEYS, getTemplate } from "./registry";

export {
  toBrandIntroProps,
  toTextAnimationProps,
  toCarouselToVideoProps,
  toPromoVideoProps,
  toReportVideoProps,
} from "./brand/apply-brand-kit";
