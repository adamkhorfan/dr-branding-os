"use client";

import type { Client } from "@/types/client";

export function PortalHeader({ client }: { client: Client }) {
  const primary =
    client.brandKit?.palette.find((p) => p.role === "primary")?.hex ?? "#c9a96e";

  return (
    <div
      className="w-full border-b"
      style={{ borderColor: `${primary}30`, backgroundColor: `${primary}08` }}
    >
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {client.brandKit?.logoUrl ? (
            <img
              src={client.brandKit.logoUrl}
              alt={client.name}
              className="h-10 object-contain"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${primary}20`, color: primary }}
            >
              {client.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-bold text-white text-lg">{client.name}</div>
            <div className="text-xs text-white/40">Client Portal</div>
          </div>
        </div>
        <div
          className="text-xs px-3 py-1.5 rounded-full border font-medium"
          style={{ borderColor: `${primary}40`, color: primary }}
        >
          Powered by DR Branding OS
        </div>
      </div>
    </div>
  );
}
