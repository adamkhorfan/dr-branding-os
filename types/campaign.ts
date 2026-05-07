import type { ID, ISODate, Timestamps } from "./common";

export type CampaignStatus =
  | "planning"
  | "in-production"
  | "live"
  | "completed"
  | "archived";

export interface CampaignMilestone {
  id: ID;
  title: string;
  dueDate?: ISODate;
  done: boolean;
}

export interface Campaign extends Timestamps {
  id: ID;
  clientId: ID;
  name: string;
  objective: string;
  startDate?: ISODate;
  endDate?: ISODate;
  deliverableIds: ID[];
  milestones: CampaignMilestone[];
  status: CampaignStatus;
  budget?: number;
}

export interface CampaignCreateInput {
  clientId: string;
  name: string;
  objective?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}
