"use client";

import { useEffect, useState, useCallback } from "react";
import { Eraser, Zap } from "lucide-react";
import { useAiChatStore } from "@/store/useAiChatStore";
import { useClientsStore } from "@/store/useClientsStore";
import { useContentStore } from "@/store/useContentStore";
import { useCampaignsStore } from "@/store/useCampaignsStore";
import { useWorkflowsStore } from "@/store/useWorkflowsStore";
import { useReportsStore } from "@/store/useReportsStore";
import { buildOsContext } from "@/lib/ai/buildContext";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { Button } from "@/components/ui/button";

export function AiCommandCenter() {
  const {
    conversations,
    activeId,
    active,
    createConversation,
    setActive,
    deleteConversation,
    addMessage,
    clearActive,
  } = useAiChatStore();

  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Stores
  const { clients, loaded: cL, load: lC } = useClientsStore();
  const { items, loaded: iL, load: lI } = useContentStore();
  const { campaigns, loaded: caL, load: lCa } = useCampaignsStore();
  const { instances, loaded: wL, load: lW } = useWorkflowsStore();
  const { reports, loaded: rL, load: lR } = useReportsStore();

  useEffect(() => {
    if (!cL) lC();
    if (!iL) lI();
    if (!caL) lCa();
    if (!wL) lW();
    if (!rL) lR();
  }, [cL, iL, caL, wL, rL, lC, lI, lCa, lW, lR]);

  // Auto-create first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    } else if (!activeId) {
      setActive(conversations[0].id);
    }
  }, [conversations, activeId, createConversation, setActive]);

  const sendMessage = useCallback(
    async (text: string) => {
      let convId = activeId;
      if (!convId) {
        convId = createConversation();
      }

      addMessage(convId, { role: "user", content: text });
      setLoading(true);
      setShowQuickActions(false);

      // Build context snapshot
      const context =
        cL && iL && caL && wL
          ? buildOsContext({ clients, items, campaigns, instances, reports })
          : undefined;

      // Get updated messages from store for this conversation
      const currentConv = useAiChatStore.getState().conversations.find((c) => c.id === convId);
      const messages = (currentConv?.messages ?? []).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages, context }),
        });
        const data = await res.json();
        const reply = data.text ?? data.error ?? "No response.";
        addMessage(convId, { role: "assistant", content: reply });
      } catch {
        addMessage(convId, {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [activeId, createConversation, addMessage, cL, iL, caL, wL, clients, items, campaigns, instances, reports],
  );

  const handleNew = useCallback(() => {
    createConversation();
    setShowQuickActions(true);
  }, [createConversation]);

  const handleClear = useCallback(() => {
    clearActive();
    setShowQuickActions(true);
  }, [clearActive]);

  const messages = active?.messages ?? [];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-border bg-bg-base shadow-sm">
      {/* Conversation list */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActive(id);
          setShowQuickActions(false);
        }}
        onNew={handleNew}
        onDelete={deleteConversation}
      />

      {/* Chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 border border-accent/20">
              <Zap className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-medium text-fg truncate max-w-64">
                {active?.title ?? "AI Command Center"}
              </div>
              <div className="text-[10px] text-fg-subtle">
                Context-aware · {cL ? clients.length : "—"} clients loaded
              </div>
            </div>
          </div>
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-1.5 text-fg-muted text-xs"
            >
              <Eraser className="h-3 w-3" strokeWidth={1.75} />
              Clear
            </Button>
          )}
        </div>

        {/* Messages */}
        <ChatMessages messages={messages} loading={loading} />

        {/* Quick actions — shown when no messages */}
        {showQuickActions && !hasMessages && !loading && (
          <div className="px-6 pb-4">
            <div className="text-xs text-fg-subtle mb-3 uppercase tracking-[0.08em]">Quick actions</div>
            <QuickActions onSelect={sendMessage} />
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
    </div>
  );
}
