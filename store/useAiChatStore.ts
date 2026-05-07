import { create } from "zustand";
import { persist } from "zustand/middleware";
import { randomUUID } from "crypto";
import type { ChatConversation, ChatMessage } from "@/types/chat";

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface AiChatState {
  conversations: ChatConversation[];
  activeId: string | null;

  // Derived
  active: ChatConversation | null;

  // Actions
  createConversation: () => string;
  setActive: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<ChatMessage, "id" | "createdAt">) => void;
  clearActive: () => void;
  renameConversation: (id: string, title: string) => void;
}

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,

      get active() {
        const { conversations, activeId } = get();
        return conversations.find((c) => c.id === activeId) ?? null;
      },

      createConversation: () => {
        const id = uuid();
        const now = new Date().toISOString();
        const conv: ChatConversation = {
          id,
          title: "New conversation",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeId: id,
        }));
        return id;
      },

      setActive: (id) => set({ activeId: id }),

      deleteConversation: (id) =>
        set((s) => {
          const remaining = s.conversations.filter((c) => c.id !== id);
          return {
            conversations: remaining,
            activeId: s.activeId === id ? (remaining[0]?.id ?? null) : s.activeId,
          };
        }),

      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const msg: ChatMessage = {
              ...message,
              id: uuid(),
              createdAt: new Date().toISOString(),
            };
            const title =
              c.messages.length === 0 && message.role === "user"
                ? message.content.slice(0, 48) + (message.content.length > 48 ? "…" : "")
                : c.title;
            return {
              ...c,
              title,
              messages: [...c.messages, msg],
              updatedAt: new Date().toISOString(),
            };
          }),
        })),

      clearActive: () =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === s.activeId
              ? { ...c, messages: [], title: "New conversation", updatedAt: new Date().toISOString() }
              : c,
          ),
        })),

      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),
    }),
    { name: "dr-branding-ai-chat" },
  ),
);
