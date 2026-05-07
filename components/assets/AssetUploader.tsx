"use client";

import React, { useRef, useState, useCallback } from "react";
import { Image, Type, FileText, Film, Upload } from "lucide-react";

interface AssetUploaderProps {
  clientId: string;
  onUpload: (file: File, dataUrl: string) => void;
}

const ACCEPTED_MIME: Record<string, string> = {
  "image/png": "image",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/svg+xml": "image",
  "image/webp": "image",
  "font/ttf": "font",
  "font/otf": "font",
  "font/woff": "font",
  "font/woff2": "font",
  // browsers sometimes report these
  "application/x-font-ttf": "font",
  "application/x-font-otf": "font",
  "application/font-woff": "font",
  "application/font-woff2": "font",
  "application/pdf": "document",
  "video/mp4": "video",
};

const ACCEPT_ATTR =
  "image/png,image/jpeg,image/gif,image/svg+xml,image/webp,.ttf,.otf,.woff,.woff2,application/pdf,video/mp4";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const category = ACCEPTED_MIME[mimeType] ?? "other";
  const cls = "w-8 h-8 text-fg-muted";
  if (category === "image") return <Image className={cls} />;
  if (category === "font") return <Type className={cls} />;
  if (category === "document") return <FileText className={cls} />;
  if (category === "video") return <Film className={cls} />;
  return <Upload className={cls} />;
}

export function AssetUploader({ clientId, onUpload }: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setProcessing(true);
      for (const file of Array.from(files)) {
        try {
          const dataUrl = await readFileAsDataUrl(file);
          onUpload(file, dataUrl);
        } catch {
          // skip failed reads silently
        }
      }
      setProcessing(false);
    },
    [onUpload]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const onClick = () => inputRef.current?.click();
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset so same file can be re-uploaded
    e.target.value = "";
  };

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={[
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer select-none transition-colors",
        dragging
          ? "border-accent bg-accent/5"
          : "border-border hover:border-accent/50 hover:bg-bg-elevated",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={onInputChange}
      />
      <div className="flex items-center gap-3 text-fg-muted">
        <Image className="w-5 h-5" />
        <Type className="w-5 h-5" />
        <FileText className="w-5 h-5" />
        <Film className="w-5 h-5" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-fg">
          {processing ? "Processing files…" : "Drop files here or click to upload"}
        </p>
        <p className="text-xs text-fg-subtle mt-1">
          PNG, JPG, GIF, SVG, WEBP · TTF, OTF, WOFF · PDF · MP4
        </p>
      </div>
    </div>
  );
}
