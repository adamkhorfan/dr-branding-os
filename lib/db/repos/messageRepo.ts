import { db, COLLECTIONS } from "@/lib/db";
import { nowIso, uid } from "@/lib/utils";
import type { MessageThread, Message, MessageDirection, ThreadCreateInput } from "@/types/message";

const C = COLLECTIONS.messages;

export const messageRepo = {
  async list(): Promise<MessageThread[]> {
    return db.list<MessageThread>(C);
  },

  async listByClient(clientId: string): Promise<MessageThread[]> {
    const all = await db.list<MessageThread>(C);
    return all.filter((t) => t.clientId === clientId);
  },

  async get(id: string): Promise<MessageThread | null> {
    return db.get<MessageThread>(C, id);
  },

  async createThread(input: ThreadCreateInput): Promise<MessageThread> {
    const ts = nowIso();
    const messageId = uid("msg");
    const thread: MessageThread = {
      id: uid("th"),
      clientId: input.clientId,
      subject: input.subject,
      lastMessageAt: ts,
      unreadCount: input.direction === "inbound" ? 1 : 0,
      archived: false,
      messages: [
        {
          id: messageId,
          threadId: uid("th"),
          content: input.firstMessage,
          direction: input.direction,
          authorName: input.direction === "outbound" ? "You" : "Client",
          createdAt: ts,
          readAt: input.direction === "outbound" ? ts : undefined,
        },
      ],
    };
    // Fix: set threadId on the message after we know the thread id
    thread.messages[0].threadId = thread.id;
    return db.create<MessageThread>(C, thread);
  },

  async addMessage(
    threadId: string,
    content: string,
    direction: MessageDirection,
    authorName?: string,
  ): Promise<MessageThread> {
    const thread = await db.get<MessageThread>(C, threadId);
    if (!thread) throw new Error(`Thread ${threadId} not found`);
    const ts = nowIso();
    const msg: Message = {
      id: uid("msg"),
      threadId,
      content,
      direction,
      authorName: authorName ?? (direction === "outbound" ? "You" : "Client"),
      createdAt: ts,
      readAt: direction === "outbound" ? ts : undefined,
    };
    const messages = [...thread.messages, msg];
    const unreadCount =
      direction === "inbound" ? thread.unreadCount + 1 : thread.unreadCount;
    return db.update<MessageThread>(C, threadId, {
      messages,
      lastMessageAt: ts,
      unreadCount,
    });
  },

  async markRead(threadId: string): Promise<MessageThread> {
    const thread = await db.get<MessageThread>(C, threadId);
    if (!thread) throw new Error(`Thread ${threadId} not found`);
    const messages = thread.messages.map((m) =>
      m.readAt ? m : { ...m, readAt: nowIso() },
    );
    return db.update<MessageThread>(C, threadId, { messages, unreadCount: 0 });
  },

  async archive(threadId: string): Promise<MessageThread> {
    return db.update<MessageThread>(C, threadId, { archived: true });
  },

  async remove(threadId: string): Promise<void> {
    return db.remove(C, threadId);
  },
};
