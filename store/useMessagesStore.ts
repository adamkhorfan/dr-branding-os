"use client";

import { create } from "zustand";
import { messageRepo } from "@/lib/db/repos/messageRepo";
import type { MessageThread, MessageDirection, ThreadCreateInput } from "@/types/message";

interface MessagesState {
  threads: MessageThread[];
  loaded: boolean;
  loading: boolean;

  load: () => Promise<void>;
  createThread: (input: ThreadCreateInput) => Promise<MessageThread>;
  reply: (threadId: string, content: string, direction: MessageDirection) => Promise<void>;
  markRead: (threadId: string) => Promise<void>;
  archive: (threadId: string) => Promise<void>;
  remove: (threadId: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set, get) => {
  function replace(updated: MessageThread) {
    set((s) => ({
      threads: s.threads.map((t) => (t.id === updated.id ? updated : t)),
    }));
  }

  return {
    threads: [],
    loaded: false,
    loading: false,

    async load() {
      if (get().loading) return;
      set({ loading: true });
      const threads = await messageRepo.list();
      set({ threads, loaded: true, loading: false });
    },

    async createThread(input) {
      const thread = await messageRepo.createThread(input);
      set((s) => ({ threads: [thread, ...s.threads] }));
      return thread;
    },

    async reply(threadId, content, direction) {
      const updated = await messageRepo.addMessage(threadId, content, direction);
      replace(updated);
    },

    async markRead(threadId) {
      const updated = await messageRepo.markRead(threadId);
      replace(updated);
    },

    async archive(threadId) {
      const updated = await messageRepo.archive(threadId);
      replace(updated);
    },

    async remove(threadId) {
      await messageRepo.remove(threadId);
      set((s) => ({ threads: s.threads.filter((t) => t.id !== threadId) }));
    },
  };
});
