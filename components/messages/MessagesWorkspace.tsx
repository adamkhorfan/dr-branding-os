"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Archive,
  Trash2,
  User,
  Building2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ClientSelector } from "@/components/studio/ClientSelector";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useClientsStore } from "@/store/useClientsStore";
import type { MessageThread, MessageDirection } from "@/types/message";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const DIR_ICON: Record<MessageDirection, React.ElementType> = {
  outbound: User,
  inbound: Building2,
  note: FileText,
};

const DIR_LABEL: Record<MessageDirection, string> = {
  outbound: "Sent",
  inbound: "Client",
  note: "Note",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function MessagesWorkspace() {
  const { threads, loaded, load, createThread, reply, markRead, archive, remove } =
    useMessagesStore();
  const { clients } = useClientsStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyDir, setReplyDir] = useState<MessageDirection>("outbound");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const active = threads.find((t) => t.id === activeId);

  function handleSelect(thread: MessageThread) {
    setActiveId(thread.id);
    if (thread.unreadCount > 0) markRead(thread.id);
  }

  async function handleReply() {
    if (!activeId || !replyText.trim()) return;
    await reply(activeId, replyText.trim(), replyDir);
    setReplyText("");
  }

  function clientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.name ?? "Unknown";
  }

  const totalUnread = threads.reduce((n, t) => n + t.unreadCount, 0);

  return (
    <div className="flex gap-0 surface rounded-xl border border-border overflow-hidden min-h-[600px]">
      {/* Thread list */}
      <div className="w-[280px] shrink-0 border-r border-border flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-fg">Inbox</span>
            {totalUnread > 0 && (
              <Badge variant="accent">{totalUnread}</Badge>
            )}
          </div>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowNew(true)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {threads.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xs text-fg-subtle text-center px-4">
              No messages yet. Start a new thread.
            </div>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-border">
            {threads
              .filter((t) => !t.archived)
              .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
              .map((thread) => (
                <li key={thread.id}>
                  <button
                    onClick={() => handleSelect(thread)}
                    className={cn(
                      "w-full text-left px-4 py-3 transition-colors hover:bg-bg-elevated/60",
                      activeId === thread.id && "bg-bg-elevated",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "text-xs font-medium leading-snug truncate flex-1",
                          thread.unreadCount > 0 ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        {thread.subject}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="h-4 w-4 rounded-full bg-accent text-bg-base text-2xs font-bold flex items-center justify-center shrink-0">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-2xs text-fg-subtle mt-0.5 truncate">
                      {clientName(thread.clientId)}
                    </div>
                    <div className="text-2xs text-fg-subtle mt-0.5">
                      {timeAgo(thread.lastMessageAt)}
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Thread view */}
      <div className="flex-1 flex flex-col min-w-0">
        {!active ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a thread"
              description="Choose a conversation from the left, or start a new one."
              action={
                <Button onClick={() => setShowNew(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  New Thread
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div>
                <div className="text-sm font-medium text-fg">{active.subject}</div>
                <div className="text-xs text-fg-subtle">{clientName(active.clientId)}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { archive(active.id); setActiveId(null); }}
                  className="p-1.5 rounded text-fg-subtle hover:text-fg hover:bg-bg-elevated transition-colors"
                  title="Archive"
                >
                  <Archive className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { remove(active.id); setActiveId(null); }}
                  className="p-1.5 rounded text-fg-subtle hover:text-danger hover:bg-bg-elevated transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {active.messages.map((msg) => {
                const Icon = DIR_ICON[msg.direction];
                const isOutbound = msg.direction === "outbound";
                const isNote = msg.direction === "note";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      isOutbound ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full border shrink-0 flex items-center justify-center",
                        isOutbound
                          ? "bg-accent/10 border-accent/30"
                          : isNote
                            ? "bg-warning/10 border-warning/30"
                            : "bg-bg-elevated border-border",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          isOutbound ? "text-accent" : isNote ? "text-warning" : "text-fg-subtle",
                        )}
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className={cn("max-w-[72%]", isOutbound && "items-end flex flex-col")}>
                      <div
                        className={cn(
                          "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                          isOutbound
                            ? "bg-accent/10 text-fg rounded-tr-sm"
                            : isNote
                              ? "bg-warning/8 border border-warning/20 text-fg rounded-tl-sm italic"
                              : "bg-bg-elevated text-fg rounded-tl-sm",
                        )}
                      >
                        {msg.content}
                      </div>
                      <div className="text-2xs text-fg-subtle mt-1 px-1">
                        {DIR_LABEL[msg.direction]} · {timeAgo(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose */}
            <div className="border-t border-border px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                {(["outbound", "inbound", "note"] as MessageDirection[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setReplyDir(d)}
                    className={cn(
                      "text-2xs uppercase tracking-wider px-2 py-1 rounded border transition-colors",
                      replyDir === d
                        ? "border-accent/50 bg-accent/8 text-accent"
                        : "border-border text-fg-subtle hover:text-fg",
                    )}
                  >
                    {DIR_LABEL[d]}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    replyDir === "note"
                      ? "Add an internal note…"
                      : replyDir === "inbound"
                        ? "Log a message from the client…"
                        : "Write your reply…"
                  }
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply();
                  }}
                  className="flex-1 rounded-md border border-border bg-bg-base text-sm text-fg px-3 py-2 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
                <Button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="self-end"
                  size="sm"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-2xs text-fg-subtle">⌘ + Enter to send</p>
            </div>
          </>
        )}
      </div>

      <NewThreadDialog
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreate={async (input) => {
          const t = await createThread(input);
          setActiveId(t.id);
          setShowNew(false);
        }}
      />
    </div>
  );
}

interface NewThreadDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { clientId: string; subject: string; firstMessage: string; direction: MessageDirection }) => void;
}

function NewThreadDialog({ open, onClose, onCreate }: NewThreadDialogProps) {
  const [clientId, setClientId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [dir, setDir] = useState<MessageDirection>("outbound");

  function reset() { setClientId(""); setSubject(""); setMessage(""); setDir("outbound"); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !subject || !message) return;
    onCreate({ clientId, subject, firstMessage: message, direction: dir });
    reset();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md surface rounded-xl shadow-2xl p-6 focus:outline-none">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-fg">New Thread</Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1.5 text-fg-subtle hover:text-fg hover:bg-bg-elevated transition-colors">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">Client *</label>
              <ClientSelector value={clientId} onChange={setClientId} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-medium text-fg-muted mb-1.5 block">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Content approval for June batch"
                required
                className="w-full h-9 rounded-md border border-border bg-bg-base text-sm text-fg px-3 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-xs font-medium text-fg-muted">Message *</label>
                <div className="flex gap-1 ml-auto">
                  {(["outbound", "inbound", "note"] as MessageDirection[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDir(d)}
                      className={cn(
                        "text-2xs uppercase tracking-wider px-2 py-0.5 rounded border transition-colors",
                        dir === d
                          ? "border-accent/50 bg-accent/8 text-accent"
                          : "border-border text-fg-subtle hover:text-fg",
                      )}
                    >
                      {DIR_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
                placeholder="Write your first message…"
                className="w-full rounded-md border border-border bg-bg-base text-sm text-fg px-3 py-2 placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="secondary" onClick={() => { reset(); onClose(); }}>Cancel</Button>
              <Button type="submit" disabled={!clientId || !subject || !message}>Create Thread</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
