import type { ID, ISODate, Timestamps } from "./common";

export type N8nNodeType =
  | "trigger.manual"
  | "trigger.webhook"
  | "trigger.schedule"
  | "trigger.workflow"
  | "action.http"
  | "action.email"
  | "action.slack"
  | "action.content"
  | "condition.if"
  | "delay"
  | "note";

export interface N8nFlowNode {
  id: ID;
  type: N8nNodeType;
  name: string;
  config: Record<string, string>;
}

export interface N8nFlow extends Timestamps {
  id: ID;
  name: string;
  description?: string;
  nodes: N8nFlowNode[];
  active: boolean;
}

export type N8nFlowCreateInput = {
  name: string;
  description?: string;
  nodes?: N8nFlowNode[];
};
