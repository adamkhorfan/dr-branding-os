"use client";

import type { TemplateKey } from "../types";
import { getTemplate } from "../registry";
import { Film, Play } from "lucide-react";

interface PlayerShellProps {
  templateKey: TemplateKey;
  inputProps?: Record<string, unknown>;
  controls?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  style?: React.CSSProperties;
}

export function PlayerShell({ templateKey, style }: PlayerShellProps) {
  const entry = getTemplate(templateKey);

  return (
    <div
      style={style}
      className="w-full h-full min-h-[320px] bg-[#0d0d0d] rounded-xl flex flex-col items-center justify-center gap-4 border border-white/8"
    >
      <div className="w-14 h-14 rounded-full bg-white/6 flex items-center justify-center">
        <Film className="w-6 h-6 text-[#c9a96e]" />
      </div>
      <div className="text-center px-6">
        <p className="text-white/70 font-semibold text-sm">{entry.label}</p>
        <p className="text-white/30 text-xs mt-1">
          Live preview requires Remotion
        </p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white/40 font-mono">
        npm install remotion @remotion/player
      </div>
      <div className="flex items-center gap-2 text-[11px] text-white/25">
        <Play className="w-3 h-3" />
        {entry.width} × {entry.height} · {entry.fps}fps · {(entry.durationInFrames / entry.fps).toFixed(1)}s
      </div>
    </div>
  );
}
