"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Upload, ChevronDown } from "lucide-react";
import { useAssetsStore } from "@/store/useAssetsStore";
import { useClientsStore } from "@/store/useClientsStore";
import { AssetUploader } from "./AssetUploader";
import { AssetGrid } from "./AssetGrid";
import type { AssetType, BrandAsset } from "@/types/asset";

const FILTER_TABS: { label: string; value: AssetType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Logos", value: "logo" },
  { label: "Images", value: "image" },
  { label: "Fonts", value: "font" },
  { label: "Documents", value: "document" },
  { label: "Videos", value: "video" },
];

const MIME_TO_TYPE: Record<string, AssetType> = {
  "image/png": "image",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/webp": "image",
  "font/ttf": "font",
  "font/otf": "font",
  "font/woff": "font",
  "font/woff2": "font",
  "application/x-font-ttf": "font",
  "application/x-font-otf": "font",
  "application/font-woff": "font",
  "application/font-woff2": "font",
  "application/pdf": "document",
  "video/mp4": "video",
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AssetManagerWorkspace() {
  const { assets, loaded, load, add, remove } = useAssetsStore();
  const { clients, loaded: clientsLoaded, load: loadClients } = useClientsStore();

  const [selectedClientId, setSelectedClientId] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<AssetType | "all">("all");
  const [showUploader, setShowUploader] = useState(false);
  const uploaderClientId = selectedClientId === "all" ? "" : selectedClientId;

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  useEffect(() => {
    if (!clientsLoaded) loadClients();
  }, [clientsLoaded, loadClients]);

  // Filtered assets based on client selector + type filter
  const filteredAssets = useMemo(() => {
    let list = assets;
    if (selectedClientId !== "all") {
      list = list.filter((a) => a.clientId === selectedClientId);
    }
    if (activeFilter !== "all") {
      list = list.filter((a) => a.type === activeFilter);
    }
    return list;
  }, [assets, selectedClientId, activeFilter]);

  // Summary stats
  const scopedAssets = useMemo(() => {
    if (selectedClientId === "all") return assets;
    return assets.filter((a) => a.clientId === selectedClientId);
  }, [assets, selectedClientId]);

  const totalSize = scopedAssets.reduce((sum, a) => sum + a.sizeBytes, 0);

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<AssetType, number>> = {};
    for (const a of scopedAssets) {
      counts[a.type] = (counts[a.type] ?? 0) + 1;
    }
    return counts;
  }, [scopedAssets]);

  function handleUpload(file: File, dataUrl: string) {
    const resolvedType: AssetType = MIME_TO_TYPE[file.type] ?? "other";
    const clientId =
      selectedClientId !== "all" ? selectedClientId : clients[0]?.id ?? "unknown";

    add({
      clientId,
      name: file.name,
      type: resolvedType,
      url: dataUrl,
      mimeType: file.type,
      sizeBytes: file.size,
      tags: [],
    });
  }

  const activeClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Client selector */}
        <div className="relative">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="appearance-none bg-bg-elevated border border-border text-fg text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
        </div>

        <div className="flex-1" />

        {/* Upload button */}
        <button
          onClick={() => setShowUploader((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      {/* Uploader (toggled) */}
      {showUploader && (
        <AssetUploader
          clientId={uploaderClientId}
          onUpload={(file, dataUrl) => {
            handleUpload(file, dataUrl);
          }}
        />
      )}

      {/* Summary bar */}
      <div className="surface rounded-xl px-5 py-4 flex flex-wrap gap-4 items-center text-sm">
        <div>
          <span className="text-fg-subtle text-xs uppercase tracking-wider">Total assets</span>
          <p className="text-fg font-semibold">{scopedAssets.length}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <span className="text-fg-subtle text-xs uppercase tracking-wider">Total size</span>
          <p className="text-fg font-semibold">{formatSize(totalSize)}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex flex-wrap gap-3">
          {(Object.entries(typeCounts) as [AssetType, number][]).map(([type, count]) => (
            <span key={type} className="text-xs text-fg-muted capitalize">
              {type}s: <span className="text-fg font-medium">{count}</span>
            </span>
          ))}
          {Object.keys(typeCounts).length === 0 && (
            <span className="text-xs text-fg-subtle">No breakdown yet</span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap border-b border-border pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={[
              "px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors",
              activeFilter === tab.value
                ? "text-accent border-b-2 border-accent"
                : "text-fg-muted hover:text-fg",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Asset grid */}
      <AssetGrid assets={filteredAssets} onDelete={remove} />
    </div>
  );
}
