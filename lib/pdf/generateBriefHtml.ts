import type { Client } from "@/types/client";

export function generateBriefHtml(client: Client): string {
  const primaryColor = client.brandKit.palette[0]?.hex ?? "#c9a96e";

  const swatches = client.brandKit.palette
    .map(
      (c) => `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: ${c.hex};
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        "></div>
        <div>
          <div style="font-size: 13px; font-weight: 600; color: #e5e5e5;">${c.name ?? "Color"}</div>
          <div style="font-size: 11px; color: #666; font-family: monospace;">${c.hex}</div>
          ${c.role ? `<div style="font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;">${c.role}</div>` : ""}
        </div>
      </div>
    `,
    )
    .join("");

  const goalsList = client.goals.goals
    .map(
      (g) => `
      <li style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; font-size:14px; color:#ccc; line-height:1.6;">
        <span style="color:${primaryColor}; font-weight:bold; margin-top:2px;">→</span>
        <span>${g}</span>
      </li>
    `,
    )
    .join("");

  const offersList = client.brief.offers
    .map(
      (o) => `
      <li style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; font-size:14px; color:#ccc; line-height:1.6;">
        <span style="color:${primaryColor}; font-weight:bold;">·</span>
        <span>${o}</span>
      </li>
    `,
    )
    .join("");

  const competitorsRows = client.competitors
    .map(
      (comp) => `
      <tr>
        <td style="padding:10px 14px; border-bottom:1px solid #222; font-size:13px; color:#e5e5e5; font-weight:500;">${comp.name}</td>
        <td style="padding:10px 14px; border-bottom:1px solid #222; font-size:13px; color:#888;">
          ${comp.url ? `<a href="${comp.url}" style="color:#c9a96e; text-decoration:none;">${comp.url}</a>` : "—"}
        </td>
        <td style="padding:10px 14px; border-bottom:1px solid #222; font-size:13px; color:#888;">${comp.notes ?? "—"}</td>
      </tr>
    `,
    )
    .join("");

  const dosList = client.brandKit.contentDos
    .map(
      (d) => `
      <li style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; font-size:13px; color:#ccc; line-height:1.5;">
        <span style="color:#4ade80; font-weight:bold;">✓</span>
        <span>${d}</span>
      </li>
    `,
    )
    .join("");

  const dontsList = client.brandKit.contentDonts
    .map(
      (d) => `
      <li style="display:flex; align-items:flex-start; gap:10px; margin-bottom:8px; font-size:13px; color:#ccc; line-height:1.5;">
        <span style="color:#f87171; font-weight:bold;">✕</span>
        <span>${d}</span>
      </li>
    `,
    )
    .join("");

  const audienceEmotions =
    client.goals.audienceEmotions.length > 0
      ? client.goals.audienceEmotions
          .map(
            (e) =>
              `<span style="display:inline-block; background:#1a1a1a; border:1px solid #333; border-radius:20px; padding:3px 12px; font-size:11px; color:#aaa; margin:3px;">${e}</span>`,
          )
          .join("")
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${client.name} — Brand Brief</title>
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
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>
  <div style="max-width: 860px; margin: 0 auto; padding: 48px 40px;">

    <!-- Header -->
    <div style="
      margin-bottom: 48px;
      padding-bottom: 28px;
      border-bottom: 1px solid #2a2a2a;
    ">
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: ${primaryColor}; margin-bottom: 12px;">
        DR Branding OS · Brand Brief
      </div>
      <h1 style="font-size: 36px; font-weight: 700; color: #fff; letter-spacing: -0.5px; line-height: 1.15;">
        ${client.name}
      </h1>
      ${client.industry ? `<div style="font-size: 14px; color: #777; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em;">${client.industry}</div>` : ""}
      <div style="font-size: 11px; color: #555; margin-top: 8px;">Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
    </div>

    <!-- Positioning -->
    ${
      client.brief.positioning
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Positioning Statement
      </h2>
      <p style="font-size:16px; color:#e5e5e5; line-height:1.7; font-style:italic; border-left:3px solid ${primaryColor}; padding-left:18px;">
        "${client.brief.positioning}"
      </p>
    </div>
    `
        : ""
    }

    <!-- Services / Offers -->
    ${
      client.brief.offers.length > 0
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Services &amp; Offers
      </h2>
      <ul>${offersList}</ul>
    </div>
    `
        : ""
    }

    <!-- Goals -->
    ${
      client.goals.goals.length > 0
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Goals
      </h2>
      <ul>${goalsList}</ul>
    </div>
    `
        : ""
    }

    <!-- Target Audience -->
    ${
      client.goals.audience
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Target Audience
      </h2>
      <p style="font-size:14px; color:#ccc; line-height:1.7;">${client.goals.audience}</p>
      ${
        audienceEmotions
          ? `<div style="margin-top:12px;">${audienceEmotions}</div>`
          : ""
      }
    </div>
    `
        : ""
    }

    <!-- Brand Colors -->
    ${
      client.brandKit.palette.length > 0
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Brand Colors
      </h2>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${swatches}
      </div>
    </div>
    `
        : ""
    }

    <!-- Typography -->
    ${
      client.brandKit.typographyPrimary || client.brandKit.typographySecondary
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Typography
      </h2>
      <div style="display:flex; gap:32px; flex-wrap:wrap;">
        ${client.brandKit.typographyPrimary ? `<div><div style="font-size:11px; color:#555; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em;">Primary</div><div style="font-size:15px; color:#e5e5e5; font-weight:600;">${client.brandKit.typographyPrimary}</div></div>` : ""}
        ${client.brandKit.typographySecondary ? `<div><div style="font-size:11px; color:#555; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.06em;">Secondary</div><div style="font-size:15px; color:#e5e5e5;">${client.brandKit.typographySecondary}</div></div>` : ""}
      </div>
    </div>
    `
        : ""
    }

    <!-- Tone of Voice + Visual Style -->
    ${
      client.brandKit.toneOfVoice || client.brandKit.visualStyle
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Brand Voice &amp; Style
      </h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        ${
          client.brandKit.toneOfVoice
            ? `
          <div style="background:#111; border:1px solid #222; border-radius:10px; padding:18px;">
            <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:#555; margin-bottom:8px;">Tone of Voice</div>
            <p style="font-size:13px; color:#ccc; line-height:1.6;">${client.brandKit.toneOfVoice}</p>
          </div>
        `
            : ""
        }
        ${
          client.brandKit.visualStyle
            ? `
          <div style="background:#111; border:1px solid #222; border-radius:10px; padding:18px;">
            <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:#555; margin-bottom:8px;">Visual Style</div>
            <p style="font-size:13px; color:#ccc; line-height:1.6;">${client.brandKit.visualStyle}</p>
          </div>
        `
            : ""
        }
      </div>
    </div>
    `
        : ""
    }

    <!-- Content Dos & Don'ts -->
    ${
      client.brandKit.contentDos.length > 0 || client.brandKit.contentDonts.length > 0
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Content Guidelines
      </h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        ${
          client.brandKit.contentDos.length > 0
            ? `
          <div>
            <div style="font-size:11px; color:#4ade80; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Do</div>
            <ul>${dosList}</ul>
          </div>
        `
            : ""
        }
        ${
          client.brandKit.contentDonts.length > 0
            ? `
          <div>
            <div style="font-size:11px; color:#f87171; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px;">Don't</div>
            <ul>${dontsList}</ul>
          </div>
        `
            : ""
        }
      </div>
    </div>
    `
        : ""
    }

    <!-- Competitors -->
    ${
      client.competitors.length > 0
        ? `
    <div style="margin-bottom: 36px;">
      <h2 style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:${primaryColor}; margin-bottom:14px; padding-bottom:8px; border-bottom:1px solid #2a2a2a;">
        Competitive Landscape
      </h2>
      <table>
        <thead>
          <tr style="background:#111;">
            <th style="padding:10px 14px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#555; font-weight:600; border-bottom:1px solid #222;">Name</th>
            <th style="padding:10px 14px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#555; font-weight:600; border-bottom:1px solid #222;">URL</th>
            <th style="padding:10px 14px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:#555; font-weight:600; border-bottom:1px solid #222;">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${competitorsRows}
        </tbody>
      </table>
    </div>
    `
        : ""
    }

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
      <div style="font-size: 11px; color: #444;">${client.name} · Brand Brief</div>
    </div>

  </div>
</body>
</html>`;
}
