// ─── Shared helpers ──────────────────────────────────────────────────────────

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header bar -->
          <tr>
            <td style="padding-bottom:32px;">
              <span style="display:inline-block;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#c9a96e;">DR Branding OS</span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:36px 36px 28px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#555;letter-spacing:0.04em;">
                Sent by DR Branding OS &nbsp;&middot;&nbsp; You are receiving this as a client.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#c9a96e;color:#111;font-size:13px;font-weight:600;letter-spacing:0.04em;text-decoration:none;border-radius:6px;">${label}</a>`;
}

function statBox(value: string | number, label: string): string {
  return `<td style="text-align:center;padding:16px 20px;background:#111;border:1px solid #2a2a2a;border-radius:8px;">
    <div style="font-size:28px;font-weight:700;color:#c9a96e;line-height:1;">${value}</div>
    <div style="font-size:11px;color:#888;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase;">${label}</div>
  </td>`;
}

// ─── Approval Request ────────────────────────────────────────────────────────

export interface ApprovalRequestParams {
  clientName: string;
  itemTitle: string;
  itemType: string;
  portalUrl: string;
  agencyName?: string;
}

export function approvalRequestEmail(params: ApprovalRequestParams): string {
  const { clientName, itemTitle, itemType, portalUrl, agencyName = "DR Branding" } = params;

  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Review requested</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#888;">Hi ${clientName}, ${agencyName} has submitted a piece of content for your review.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;margin-bottom:8px;">
      <tr>
        <td style="padding:16px 20px;background:#111;">
          <div style="font-size:11px;color:#c9a96e;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">${itemType}</div>
          <div style="font-size:16px;font-weight:600;color:#fff;">${itemTitle}</div>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 4px;font-size:13px;color:#aaa;line-height:1.6;">
      Please visit your client portal to review and approve (or request changes to) this item. Your feedback keeps the project moving forward.
    </p>

    ${ctaButton(portalUrl, "Review in portal")}

    <p style="margin:28px 0 0;font-size:12px;color:#555;border-top:1px solid #2a2a2a;padding-top:20px;">
      If you have questions, reply directly to this email or reach out to your account manager.
    </p>
  `;

  return base(`Content review: ${itemTitle}`, body);
}

// ─── Weekly Update ───────────────────────────────────────────────────────────

export interface WeeklyUpdateParams {
  clientName: string;
  publishedCount: number;
  pendingCount: number;
  activeCampaigns: number;
  portalUrl: string;
}

export function weeklyUpdateEmail(params: WeeklyUpdateParams): string {
  const { clientName, publishedCount, pendingCount, activeCampaigns, portalUrl } = params;

  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">Your weekly update</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#888;">Hi ${clientName}, here's a summary of what happened this week.</p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:8px;">${statBox(publishedCount, "Published")}</td>
        <td style="padding:0 4px;">${statBox(pendingCount, "Pending approval")}</td>
        <td style="padding-left:8px;">${statBox(activeCampaigns, "Active campaigns")}</td>
      </tr>
    </table>

    <p style="margin:24px 0 4px;font-size:13px;color:#aaa;line-height:1.6;">
      ${pendingCount > 0
        ? `You have <strong style="color:#c9a96e;">${pendingCount} item${pendingCount !== 1 ? "s" : ""} awaiting your approval</strong>. Head to your portal to review them.`
        : "No items are pending approval this week. Great work staying on top of things!"}
    </p>

    ${ctaButton(portalUrl, "Open portal")}

    <p style="margin:28px 0 0;font-size:12px;color:#555;border-top:1px solid #2a2a2a;padding-top:20px;">
      This summary is generated automatically each week by DR Branding OS.
    </p>
  `;

  return base("Your weekly marketing update", body);
}

// ─── Report Ready ────────────────────────────────────────────────────────────

export interface ReportReadyParams {
  clientName: string;
  month: string;
  highlights: string[];
  portalUrl: string;
}

export function reportReadyEmail(params: ReportReadyParams): string {
  const { clientName, month, highlights, portalUrl } = params;

  const highlightItems = highlights
    .slice(0, 3)
    .map(
      (h) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #222;font-size:13px;color:#ddd;line-height:1.5;">
          <span style="color:#c9a96e;margin-right:8px;">&#8250;</span>${h}
        </td></tr>`,
    )
    .join("");

  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em;">${month} report is ready</h1>
    <p style="margin:0 0 28px;font-size:14px;color:#888;">Hi ${clientName}, your monthly performance report has been prepared and is available in your portal.</p>

    <div style="margin-bottom:24px;">
      <div style="font-size:11px;color:#c9a96e;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:12px;">Highlights</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${highlightItems}
      </table>
    </div>

    <p style="margin:0 0 4px;font-size:13px;color:#aaa;line-height:1.6;">
      The full report includes detailed metrics, content performance breakdowns, and recommendations for next month.
    </p>

    ${ctaButton(portalUrl, "View full report")}

    <p style="margin:28px 0 0;font-size:12px;color:#555;border-top:1px solid #2a2a2a;padding-top:20px;">
      Reports are generated monthly by DR Branding OS and reflect the previous calendar month.
    </p>
  `;

  return base(`${month} Performance Report`, body);
}
