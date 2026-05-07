import type { ID, ISODate, Timestamps } from "./common";

export type ContentType =
  | "post"
  | "carousel"
  | "reel"
  | "story"
  | "script"
  | "caption";

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "facebook";

export type ContentStatus =
  | "draft"
  | "in-review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export interface ContentItem extends Timestamps {
  id: ID;
  clientId: ID;
  type: ContentType;
  title: string;
  body?: string;
  mediaRefs?: string[];
  platforms: Platform[];
  scheduledFor?: ISODate;
  publishedAt?: ISODate;
  status: ContentStatus;
  sourceWorkflowInstanceId?: ID;
  tags?: string[];
}
