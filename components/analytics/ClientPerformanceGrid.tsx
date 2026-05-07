"use client";

import type { ClientMetrics } from "@/types/analytics";
import { FileText, Megaphone, GitBranch, MessageSquare } from "lucide-react";

function timeAgo(iso: string | null): string {
  if (!iso) return "No activity";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ClientPerformanceGrid({ clients }: { clients: ClientMetrics[] }) {
  if (clients.length === 0) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-xl p-8 text-center text-white/30 text-sm">
        No clients yet — add a client to see performance data.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {clients.map((c) => (
        <div
          key={c.clientId}
          className="bg-white/4 border border-white/8 rounded-xl p-4 flex flex-col gap-3 hover:border-[#c9a96e]/30 transition-colors"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white text-sm">{c.clientName}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{timeAgo(c.lastActivity)}</div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-[#c9a96e]/15 flex items-center justify-center text-[#c9a96e] text-xs font-bold"
            >
              {c.clientName.slice(0, 2).toUpperCase()}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-white/6">
            {[
              { icon: FileText, val: c.contentCount, label: "Content" },
              { icon: Megaphone, val: c.campaignCount, label: "Campaigns" },
              { icon: GitBranch, val: c.workflowCount, label: "Workflows" },
              { icon: MessageSquare, val: c.messageCount, label: "Messages" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-3.5 h-3.5 text-white/30" />
                <span className="text-base font-bold text-white">{val}</span>
                <span className="text-[10px] text-white/30">{label}</span>
              </div>
            ))}
          </div>

          {/* Content type breakdown */}
          {Object.keys(c.contentByType).length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/6">
              {Object.entries(c.contentByType).map(([type, count]) => (
                <span
                  key={type}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/6 text-white/50"
                >
                  {type} · {count}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
