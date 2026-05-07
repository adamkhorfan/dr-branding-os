/**
 * Converts an N8nFlow to a valid n8n workflow JSON.
 * The exported JSON can be imported directly in n8n via
 * Settings → Workflows → Import from file.
 */

import type { N8nFlow, N8nFlowNode, N8nNodeType } from "@/types/n8n";

// Maps our node types to real n8n node types
const N8N_TYPE_MAP: Record<N8nNodeType, string> = {
  "trigger.manual": "n8n-nodes-base.manualTrigger",
  "trigger.webhook": "n8n-nodes-base.webhook",
  "trigger.schedule": "n8n-nodes-base.scheduleTrigger",
  "trigger.workflow": "n8n-nodes-base.n8nTrigger",
  "action.http": "n8n-nodes-base.httpRequest",
  "action.email": "n8n-nodes-base.emailSend",
  "action.slack": "n8n-nodes-base.slack",
  "action.content": "n8n-nodes-base.httpRequest", // calls DR OS API
  "condition.if": "n8n-nodes-base.if",
  delay: "n8n-nodes-base.wait",
  note: "n8n-nodes-base.stickyNote",
};

const TYPE_VERSION: Record<string, number> = {
  "n8n-nodes-base.httpRequest": 4,
  "n8n-nodes-base.webhook": 2,
  "n8n-nodes-base.scheduleTrigger": 1,
  "n8n-nodes-base.if": 2,
};

function nodeParameters(node: N8nFlowNode): Record<string, unknown> {
  const c = node.config;
  switch (node.type) {
    case "trigger.webhook":
      return { path: c.path || node.id, httpMethod: c.method || "POST" };
    case "trigger.schedule":
      return {
        rule: {
          interval: [{ field: c.unit || "hours", hoursInterval: Number(c.interval) || 1 }],
        },
      };
    case "action.http":
    case "action.content":
      return {
        url: c.url || "",
        method: c.method || "POST",
        sendBody: true,
        bodyParameters: { parameters: [{ name: "data", value: c.body || "" }] },
      };
    case "action.email":
      return {
        toEmail: c.to || "",
        subject: c.subject || "",
        text: c.body || "",
      };
    case "action.slack":
      return {
        channel: c.channel || "#general",
        text: c.message || "",
        otherOptions: {},
      };
    case "condition.if":
      return {
        conditions: {
          string: [
            {
              value1: `={{$json["${c.field || "status"}"]}}`,
              operation: c.operator || "equal",
              value2: c.value || "",
            },
          ],
        },
      };
    case "delay":
      return {
        unit: c.unit || "hours",
        amount: Number(c.amount) || 1,
        resume: "timeInterval",
      };
    case "note":
      return { content: c.text || "" };
    default:
      return {};
  }
}

export function exportToN8nJson(flow: N8nFlow): string {
  const GRID_X_START = 240;
  const GRID_X_STEP = 220;
  const GRID_Y = 300;

  const n8nNodes = flow.nodes.map((node, idx) => ({
    parameters: nodeParameters(node),
    id: node.id,
    name: node.name,
    type: N8N_TYPE_MAP[node.type],
    typeVersion: TYPE_VERSION[N8N_TYPE_MAP[node.type]] ?? 1,
    position: [GRID_X_START + idx * GRID_X_STEP, GRID_Y] as [number, number],
  }));

  // Build linear connections: each node connects to the next
  const connections: Record<string, { main: { node: string; type: string; index: number }[][] }> =
    {};
  for (let i = 0; i < flow.nodes.length - 1; i++) {
    const from = flow.nodes[i];
    const to = flow.nodes[i + 1];
    connections[from.name] = {
      main: [[{ node: to.name, type: "main", index: 0 }]],
    };
  }

  const exported = {
    name: flow.name,
    nodes: n8nNodes,
    connections,
    active: flow.active,
    settings: { executionOrder: "v1" },
    id: flow.id,
    meta: {
      templateCredsSetupCompleted: true,
      instanceId: "dr-branding-os",
    },
  };

  return JSON.stringify(exported, null, 2);
}
