import type { ID, ISODate } from "./common";

export type MessageDirection = "outbound" | "inbound" | "note";

export interface Message {
  id: ID;
  threadId: ID;
  content: string;
  direction: MessageDirection;
  authorName: string;
  createdAt: ISODate;
  readAt?: ISODate;
}

export interface MessageThread {
  id: ID;
  clientId: ID;
  subject: string;
  lastMessageAt: ISODate;
  unreadCount: number;
  archived: boolean;
  messages: Message[];
}

export type ThreadCreateInput = {
  clientId: string;
  subject: string;
  firstMessage: string;
  direction: MessageDirection;
};
