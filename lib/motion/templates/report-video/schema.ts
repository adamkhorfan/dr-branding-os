import type { ReportVideoProps } from "../../types";

export const DEFAULT_REPORT_PROPS: ReportVideoProps = {
  clientName: "Acme Brand Co.",
  month: "April 2025",
  kpis: [
    { label: "Posts Published", value: 24 },
    { label: "Avg. Engagement", value: "4.8", unit: "%" },
    { label: "Campaigns Run", value: 3 },
  ],
  highlights: [
    "Engagement rate increased 22% month-over-month.",
    "Reels outperformed static posts by 3× average reach.",
    "Two campaigns exceeded target KPIs ahead of schedule.",
  ],
  primaryColor: "#c9a96e",
  accentColor: "#c9a96e",
  textColor: "#ffffff",
  fontFamily: "Inter, Helvetica Neue, sans-serif",
};

export const REPORT_DURATION_FRAMES = 300; // 10s at 30fps
export const REPORT_FPS = 30;
