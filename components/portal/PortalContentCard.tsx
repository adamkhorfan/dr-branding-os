"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { useContentStore } from "@/store/useContentStore";

export function PortalContentCard({ item }: { item: ContentItem }) {
  const setStatus = useContentStore((s) => s.setStatus);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleAction(status: "approved" | "draft") {
    setLoading(true);
    await setStatus(item.id, status);
    setLoading(false);
    setDone(true);
  }

  const statusColors: Record<string, string> = {
    approved: "text-emerald-400",
    "in-review": "text-amber-400",
    draft: "text-white/40",
    published: "text-blue-400",
    scheduled: "text-purple-400",
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {item.title ?? item.type}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] uppercase tracking-widest text-white/30">
              {item.type}
            </span>
            {item.platforms?.[0] && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-[11px] text-white/30">{item.platforms[0]}</span>
              </>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium ${statusColors[item.status] ?? "text-white/40"}`}>
          {item.status === "in-review" ? "Awaiting Review" : item.status}
        </span>
      </div>

      {/* Body */}
      {item.body && (
        <div className="text-sm text-white/60 leading-relaxed line-clamp-4 bg-white/3 rounded-lg p-3 border border-white/6">
          {item.body}
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/6 text-white/40"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      {item.status === "in-review" && !done && (
        <div className="flex gap-2 pt-1 border-t border-white/6">
          <button
            onClick={() => handleAction("approved")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/25 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => handleAction("draft")}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Request Changes
          </button>
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 pt-1 border-t border-white/6">
          <CheckCircle2 className="w-4 h-4" />
          Response recorded — thank you.
        </div>
      )}

      {item.status === "approved" && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 pt-1 border-t border-white/6">
          <CheckCircle2 className="w-4 h-4" />
          Approved
        </div>
      )}

      {item.status !== "in-review" && item.status !== "approved" && (
        <div className="flex items-center gap-2 text-sm text-white/30 pt-1 border-t border-white/6">
          <Eye className="w-4 h-4" />
          View only
        </div>
      )}

      <div className="text-[11px] text-white/20">
        Created {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
