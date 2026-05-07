"use client";

import type { ActivityItem } from "@/types/analytics";
import { FileText, Megaphone, GitBranch, MessageSquare, BarChart2 } from "lucide-react";

const TYPE_CONFIG = {
  content: { icon: FileText, color: "text-blue-400" },
  campaign: { icon: Megaphone, color: "text-purple-400" },
  workflow: { icon: GitBranch, color: "text-emerald-400" },
  message: { icon: MessageSquare, color: "text-amber-400" },
  report: { icon: BarChart2, color: "text-[#c9a96e]" },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-white/30 text-center py-8">
        No activity yet — start creating content to see it here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {items.slice(0, 15).map((item, idx) => {
        const { icon: Icon, color } = TYPE_CONFIG[item.type];
        return (
          <div
            key={item.id + idx}
            className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
          >
            <div className={`mt-0.5 shrink-0 ${color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white/70 truncate">{item.label}</div>
              {item.clientName && (
                <div className="text-[11px] text-white/30 mt-0.5">{item.clientName}</div>
              )}
            </div>
            <div className="text-[11px] text-white/25 shrink-0">{timeAgo(item.timestamp)}</div>
          </div>
        );
      })}
    </div>
  );
}
