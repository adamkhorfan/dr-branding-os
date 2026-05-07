"use client";

import React, { useState } from "react";
import { Image, Type, FileText, Film, Package, Trash2 } from "lucide-react";
import type { BrandAsset, AssetType } from "@/types/asset";

interface AssetGridProps {
  assets: BrandAsset[];
  onDelete: (id: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const TYPE_LABELS: Record<AssetType, string> = {
  logo: "Logo",
  image: "Image",
  font: "Font",
  video: "Video",
  document: "Doc",
  other: "Other",
};

const TYPE_COLORS: Record<AssetType, string> = {
  logo: "bg-purple-500/15 text-purple-400",
  image: "bg-blue-500/15 text-blue-400",
  font: "bg-amber-500/15 text-amber-400",
  video: "bg-rose-500/15 text-rose-400",
  document: "bg-green-500/15 text-green-400",
  other: "bg-fg-muted/10 text-fg-muted",
};

function AssetIcon({ type }: { type: AssetType }) {
  const cls = "w-10 h-10 text-fg-muted";
  if (type === "logo" || type === "image") return <Image className={cls} />;
  if (type === "font") return <Type className={cls} />;
  if (type === "document") return <FileText className={cls} />;
  if (type === "video") return <Film className={cls} />;
  return <Package className={cls} />;
}

function AssetCard({
  asset,
  onDelete,
}: {
  asset: BrandAsset;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isImage = asset.type === "image" || asset.type === "logo";
  const isFont = asset.type === "font";

  return (
    <div
      className="surface rounded-xl overflow-hidden flex flex-col group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview area */}
      <div className="relative bg-bg-inset aspect-square flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={asset.url}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : isFont ? (
          <span
            className="text-2xl font-bold text-fg-muted px-2 text-center leading-tight"
            style={{ wordBreak: "break-all" }}
          >
            {asset.name}
          </span>
        ) : (
          <AssetIcon type={asset.type} />
        )}

        {/* Delete overlay */}
        <button
          onClick={() => onDelete(asset.id)}
          className={[
            "absolute top-2 right-2 w-7 h-7 rounded-lg bg-bg-base/90 border border-border flex items-center justify-center transition-opacity",
            hovered ? "opacity-100" : "opacity-0",
          ].join(" ")}
          title="Delete asset"
        >
          <Trash2 className="w-3.5 h-3.5 text-fg-muted hover:text-red-400 transition-colors" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <p
          className="text-sm font-medium text-fg truncate"
          title={asset.name}
        >
          {asset.name}
        </p>
        <div className="flex items-center justify-between gap-1">
          <span
            className={[
              "text-2xs font-medium px-1.5 py-0.5 rounded-md",
              TYPE_COLORS[asset.type],
            ].join(" ")}
          >
            {TYPE_LABELS[asset.type]}
          </span>
          <span className="text-2xs text-fg-subtle">{formatSize(asset.sizeBytes)}</span>
        </div>
      </div>
    </div>
  );
}

export function AssetGrid({ assets, onDelete }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <Package className="w-10 h-10 text-fg-subtle" />
        <p className="text-sm text-fg-muted">No assets yet</p>
        <p className="text-xs text-fg-subtle">Upload files above to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onDelete={onDelete} />
      ))}
    </div>
  );
}
