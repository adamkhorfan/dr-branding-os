import type { Report } from "@/types/report";
import type { Client } from "@/types/client";

export function generateReportHtml(report: Report, client: Client): string {
  const monthLabel = new Date(report.month + "-01").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const primaryColor = client.brandKit.palette[0]?.hex ?? "#c9a96e";

  const kpiCards = report.kpis
    .map(
      (kpi) => `
      <div style="
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 10px;
        padding: 18px 20px;
        text-align: center;
        min-width: 120px;
      ">
        <div style="font-size: 28px; font-weight: 700; color: #c9a96e; letter-spacing: -0.5px;">
          ${kpi.value}${kpi.unit ? `<span style="font-size: 14px; color: #888; margin-left: 2px;">${kpi.unit}</span>` : ""}
        </div>
        <div style="font-size: 11px; color: #888; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.08em;">
          ${kpi.label}
        </div>
        ${
          kpi.delta !== undefined
            ? `<div style="font-size: 11px; margin-top: 4px; color: ${kpi.delta >= 0 ? "#4ade80" : "#f87171"};">
            ${kpi.delta >= 0 ? "+" : ""}${kpi.delta}%
          </div>`
            : ""
        }
      </div>
    `,
    )
    .join("");

  const highlightItems = report.highlights
    .map(
      (h) => `
      <li style="
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 10px;
        color: #ccc;
        font-size: 14px;
        line-height: 1.6;
      ">
        <span style="color: #c9a96e; font-weight: bold; margin-top: 2px;">✓</span>
        <span>${h}</span>
      </li>
    `,
    )
    .join("");

  const recommendationItems = report.recommendations
    .map(
      (r, i) => `
      <li style="
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 10px;
        color: #ccc;
        font-size: 14px;
        line-height: 1.6;
      ">
        <span style="color: #c9a96e; font-weight: bold; min-width: 20px;">${i + 1}.</span>
        <span>${r}</span>
      </li>
    `,
    )
    .join("");

  const contentSummarySection = report.contentSummary
    ? `
    <div style="margin-bottom: 36px;">
      <h2 style="
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #c9a96e;
        margin-bottom: 14px;
        padding-bottom: 8px;
        border-bottom: 1px solid #2a2a2a;
      ">Content Summary</h2>
      <p style="color: #ccc; font-size: 14px; line-height: 1.7; margin: 0;">${report.contentSummary}</p>
    </div>
  `
    : "";

  const swatches = client.brandKit.palette
    .slice(0, 5)
    .map(
      (c) =>
        `<div style="display:inline-block; width:16px; height:16px; border-radius:50%; background:${c.hex}; margin-right:6px; border:1px solid #333; vertical-align:middle;" title="${c.name ?? c.hex}"></div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${client.name} — ${monthLabel} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0d0d0d;
      color: #e5e5e5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { background: #0d0d0d !important; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
    ul { list-style: none; }
  </style>
</head>
<body>
  <div style="max-width: 860px; margin: 0 auto; padding: 48px 40px;">

    <!-- Header -->
    <div style="
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 48px;
      padding-bottom: 28px;
      border-bottom: 1px solid #2a2a2a;
    ">
      <div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #c9a96e; margin-bottom: 10px;">
          DR Branding OS · Monthly Report
        </div>
        <h1 style="font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.5px; line-height: 1.15;">
          ${client.name}
        </h1>
        <div style="font-size: 16px; color: #888; margin-top: 6px;">${monthLabel}</div>
        ${client.industry ? `<div style="font-size: 12px; color: #555; margin-top: 4px;">${client.industry}</div>` : ""}
      </div>
      <div style="text-align: right;">
        ${swatches ? `<div style="margin-bottom: 8px;">${swatches}</div>` : ""}
        <div style="font-size: 10px; color: #555;">Generated ${new Date(report.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
      </div>
    </div>

    <!-- KPI Grid -->
    <div style="margin-bottom: 40px;">
      <h2 style="
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${primaryColor};
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #2a2a2a;
      ">Key Performance Indicators</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        ${kpiCards}
      </div>
    </div>

    <!-- Highlights -->
    <div style="margin-bottom: 36px;">
      <h2 style="
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #c9a96e;
        margin-bottom: 14px;
        padding-bottom: 8px;
        border-bottom: 1px solid #2a2a2a;
      ">Highlights</h2>
      <ul>
        ${highlightItems}
      </ul>
    </div>

    ${contentSummarySection}

    <!-- Recommendations -->
    <div style="margin-bottom: 36px;">
      <h2 style="
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #c9a96e;
        margin-bottom: 14px;
        padding-bottom: 8px;
        border-bottom: 1px solid #2a2a2a;
      ">Recommendations</h2>
      <ul>
        ${recommendationItems}
      </ul>
    </div>

    <!-- Footer -->
    <div style="
      margin-top: 56px;
      padding-top: 20px;
      border-top: 1px solid #1f1f1f;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div style="font-size: 11px; color: #444;">DR Branding OS</div>
      <div style="font-size: 11px; color: #444;">${client.name} · ${monthLabel}</div>
    </div>

  </div>
</body>
</html>`;
}
