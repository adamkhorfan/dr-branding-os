"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

interface ChatMessagesProps {
  messages: ChatMessage[];
  loading?: boolean;
}

function MarkdownText({ text }: { text: string }) {
  // Simple inline markdown: **bold**, `code`, and newlines
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="bg-bg-elevated px-1 py-0.5 rounded text-[11px] font-mono text-accent">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part === "\n") return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-md shrink-0 mt-0.5 ${
          isUser ? "bg-accent/15 border border-accent/20" : "bg-bg-elevated border border-border"
        }`}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
        ) : (
          <Bot className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.75} />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-accent/10 border border-accent/20 text-fg"
            : "bg-bg-elevated border border-border text-fg"
        }`}
      >
        <MarkdownText text={message.content} />
        <div className="text-[10px] text-fg-subtle mt-2 tabular">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-elevated border border-border shrink-0 mt-0.5">
        <Bot className="h-3.5 w-3.5 text-fg-subtle" strokeWidth={1.75} />
      </div>
      <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-fg-subtle animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated border border-border">
          <Bot className="h-5 w-5 text-fg-subtle" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-sm font-medium text-fg">AI Command Center</div>
          <div className="text-xs text-fg-subtle mt-1 max-w-xs leading-relaxed">
            Ask anything about your clients, campaigns, and content — or pick a quick action below.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
