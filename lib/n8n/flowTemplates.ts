import type { N8nFlowCreateInput, N8nNodeType } from "@/types/n8n";
import { uid } from "@/lib/utils";

function node(
  type: N8nNodeType,
  name: string,
  config: Record<string, string> = {},
) {
  return { id: uid("node"), type, name, config };
}

export const FLOW_TEMPLATES: (N8nFlowCreateInput & { key: string; description: string })[] = [
  {
    key: "content-approval",
    name: "Content Approval Notification",
    description: "Notifies the client via Slack when a content item is ready for review.",
    nodes: [
      node("trigger.webhook", "Content Status Changed", { path: "content-status", method: "POST" }),
      node("condition.if", "Is Pending Approval?", { field: "status", operator: "equal", value: "in-review" }),
      node("action.slack", "Notify Client", { channel: "#client-approvals", message: "📋 New content ready for your review — please check the link in your client portal." }),
      node("action.email", "Send Email", { to: "={{$json.clientEmail}}", subject: "Content ready for review", body: "Hi, a new content piece is ready for your approval. Please log in to review." }),
    ],
  },
  {
    key: "new-client-onboarding",
    name: "New Client Onboarding",
    description: "Triggered when a new client is created. Sets up workspace and sends welcome message.",
    nodes: [
      node("trigger.webhook", "New Client Created", { path: "client-created", method: "POST" }),
      node("action.http", "Create Notion Page", { url: "https://api.notion.com/v1/pages", method: "POST", body: '{"parent":{"database_id":"YOUR_DB_ID"},"properties":{"Name":{"title":[{"text":{"content":"{{$json.name}}"}}]}}}' }),
      node("action.slack", "Notify Team", { channel: "#new-clients", message: "🎉 New client onboarded: ={{$json.name}}. Onboarding workflow started." }),
      node("action.email", "Welcome Email", { to: "={{$json.email}}", subject: "Welcome to DR Branding", body: "Welcome! We're excited to work with you. Your brand dashboard is being set up." }),
    ],
  },
  {
    key: "weekly-content-reminder",
    name: "Weekly Content Digest",
    description: "Runs every Monday. Sends a digest of all content in draft status for each client.",
    nodes: [
      node("trigger.schedule", "Every Monday 9am", { interval: "1", unit: "weeks" }),
      node("action.http", "Fetch Draft Items", { url: "https://your-os.com/api/content/drafts", method: "GET" }),
      node("condition.if", "Has Drafts?", { field: "count", operator: "largerEqual", value: "1" }),
      node("action.slack", "Post Weekly Digest", { channel: "#content-production", message: "📅 Weekly digest: ={{$json.count}} content items still in draft. Review: ={{$json.url}}" }),
    ],
  },
  {
    key: "campaign-launch",
    name: "Campaign Launch Sequence",
    description: "Fires when a campaign goes live. Triggers team notification, Slack post, and a 24h follow-up check.",
    nodes: [
      node("trigger.webhook", "Campaign Live", { path: "campaign-live", method: "POST" }),
      node("action.slack", "Announce Launch", { channel: "#campaigns", message: "🚀 Campaign launched: ={{$json.name}} for ={{$json.clientName}}. Live now!" }),
      node("delay", "Wait 24 Hours", { amount: "24", unit: "hours" }),
      node("action.http", "Check Campaign Metrics", { url: "https://your-os.com/api/campaigns/={{$json.id}}/metrics", method: "GET" }),
      node("action.slack", "Post 24h Report", { channel: "#campaigns", message: "📊 24h update for ={{$json.name}}: ={{$json.reach}} reach, ={{$json.engagement}} engagements." }),
    ],
  },
];
