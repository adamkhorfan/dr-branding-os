import type { ID, ISODate, Timestamps } from "./common";

export type WorkflowKey =
  | "onboarding"
  | "weekly-content"
  | "reel"
  | "campaign"
  | "approval"
  | "monthly-report"
  | "n8n"
  | "ai-video"
  | "competitor"
  | "repurpose";

export type WorkflowStepType = "user" | "ai" | "approval" | "export";

export type WorkflowStage =
  | "draft"
  | "in-progress"
  | "pending-approval"
  | "completed"
  | "archived";

export interface WorkflowStepDefinition {
  id: string;
  title: string;
  description?: string;
  type: WorkflowStepType;
  inputsRequired?: string[];
  aiPromptKey?: string;
  expectedOutput?: string;
  nextOnSuccess?: string;
  nextOnReject?: string;
}

export interface WorkflowDefinition {
  key: WorkflowKey;
  name: string;
  goal: string;
  inputs: string[];
  steps: WorkflowStepDefinition[];
  outputs: string[];
  stages: WorkflowStage[];
}

export type StepStatus =
  | "pending"
  | "running"
  | "awaiting-input"
  | "awaiting-approval"
  | "completed"
  | "rejected"
  | "skipped";

export interface StepState {
  status: StepStatus;
  inputs?: Record<string, unknown>;
  output?: unknown;
  notes?: string;
  startedAt?: ISODate;
  completedAt?: ISODate;
}

export interface WorkflowInstance extends Timestamps {
  id: ID;
  definitionKey: WorkflowKey;
  clientId: ID;
  currentStepId: string | null;
  status: WorkflowStage;
  stepStates: Record<string, StepState>;
  createdBy?: string;
  completedAt?: ISODate;
}
