"use client";

import { Plus, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatConversation } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <div className="w-56 shrink-0 border-r border-border flex flex-col bg-bg-base">
      <div className="px-3 py-3 border-b border-border">
        <Button onClick={onNew} size="sm" variant="secondary" className="w-full gap-1.5">
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {conversations.length === 0 ? (
          <div className="text-xs text-fg-subtle text-center py-6 px-3">
            No conversations yet. Start a new chat.
          </div>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((conv) => (
              <li key={conv.id}>
                <button
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "group w-full flex items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
                    activeId === conv.id
                      ? "bg-bg-elevated text-fg"
                      : "text-fg-muted hover:text-fg hover:bg-bg-elevated/60",
                  )}
                >
                  <MessageSquare
                    className="h-3.5 w-3.5 mt-0.5 shrink-0 text-fg-subtle"
                    strokeWidth={1.75}
                  />
                  <span className="text-xs flex-1 truncate leading-snug">{conv.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 shrink-0 text-fg-subtle hover:text-danger transition-all"
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-3 py-3 border-t border-border">
        <div className="text-[10px] text-fg-subtle uppercase tracking-[0.08em]">
          AI Command Center · M11
        </div>
      </div>
    </div>
  );
}
