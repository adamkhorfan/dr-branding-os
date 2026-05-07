"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, loading, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || loading || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  return (
    <div className="border-t border-border bg-bg-base px-4 py-3">
      <div className="flex items-end gap-2 bg-bg-elevated border border-border rounded-xl px-4 py-2.5 focus-within:border-accent/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask anything about your clients, campaigns, or content…"
          rows={1}
          disabled={disabled || loading}
          className="flex-1 resize-none bg-transparent text-sm text-fg placeholder:text-fg-subtle outline-none leading-relaxed disabled:opacity-50 max-h-40"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || loading || disabled}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-bg-base hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 mb-0.5"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </button>
      </div>
      <div className="text-[10px] text-fg-subtle text-center mt-2">
        Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}
