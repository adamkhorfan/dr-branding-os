"use client";

import { useState, useEffect } from "react";
import {
  Film,
  Type,
  LayoutGrid,
  Megaphone,
  BarChart2,
  Play,
  Download,
  ChevronDown,
  Loader2,
  CheckCircle2,
  // Loader2 kept for render state
} from "lucide-react";
import type { TemplateKey } from "@/lib/motion/types";
import { ALL_TEMPLATE_KEYS, getTemplate } from "@/lib/motion/registry";
import { useClientsStore } from "@/store/useClientsStore";
import { toBrandIntroProps, toPromoVideoProps, toReportVideoProps, toCarouselToVideoProps, toTextAnimationProps } from "@/lib/motion/brand/apply-brand-kit";

import { PlayerShell } from "@/lib/motion/preview/PlayerShell";

const TEMPLATE_ICONS: Record<TemplateKey, React.ElementType> = {
  "brand-intro": Film,
  "text-animation": Type,
  "carousel-to-video": LayoutGrid,
  "promo-video": Megaphone,
  "report-video": BarChart2,
};

type RenderState = "idle" | "bundling" | "rendering" | "done" | "error";

export function MotionTemplateStudio() {
  const { clients, loaded, load } = useClientsStore();
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("brand-intro");
  const [selectedClientId, setSelectedClientId] = useState<string>("__default__");
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [artifactUrl, setArtifactUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const entry = getTemplate(activeTemplate);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Build props: if client selected with brand kit, derive props from it; else use defaults
  const derivedProps: Record<string, unknown> = (() => {
    if (!selectedClient?.brandKit) return entry.defaultProps as unknown as Record<string, unknown>;
    const bk = selectedClient.brandKit;
    switch (activeTemplate) {
      case "brand-intro":
        return toBrandIntroProps(bk, selectedClient.name) as unknown as Record<string, unknown>;
      case "promo-video":
        return toPromoVideoProps(bk, selectedClient.name, "Get Started →") as unknown as Record<string, unknown>;
      case "report-video":
        return toReportVideoProps(bk, selectedClient.name, new Date().toLocaleString("default", { month: "long", year: "numeric" }), [], []) as unknown as Record<string, unknown>;
      case "carousel-to-video":
        return toCarouselToVideoProps(bk, [{ title: "Cover" }, { title: "Point One" }, { title: "Take Action" }], selectedClient.name) as unknown as Record<string, unknown>;
      case "text-animation":
        return toTextAnimationProps(bk, selectedClient.name) as unknown as Record<string, unknown>;
      default:
        return entry.defaultProps as unknown as Record<string, unknown>;
    }
  })();

  async function handleRender() {
    setRenderState("bundling");
    setRenderProgress(0);
    setArtifactUrl(null);
    setRenderError(null);

    try {
      // Kick off the render job
      const res = await fetch("/api/motion/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateKey: activeTemplate,
          clientId: selectedClientId,
          props: derivedProps,
          output: { format: "mp4", aspectRatio: entry.width === entry.height ? "1:1" : "16:9", fps: entry.fps },
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Render failed");

      const jobId: string = data.jobId;
      setRenderState("rendering");

      // Poll for completion every 2 seconds
      await new Promise<void>((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/motion/status/${jobId}`);
            const status = await statusRes.json();

            setRenderProgress(status.progress ?? 0);

            if (status.state === "done") {
              clearInterval(interval);
              setArtifactUrl(status.artifactUrl ?? null);
              setRenderState("done");
              resolve();
            } else if (status.state === "error") {
              clearInterval(interval);
              reject(new Error(status.error ?? "Render failed"));
            }
          } catch (e) {
            clearInterval(interval);
            reject(e);
          }
        }, 2000);
      });
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "Unknown error");
      setRenderState("error");
    }
  }

  const aspectClass =
    entry.width === entry.height ? "aspect-square" : "aspect-video";

  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 h-full min-h-0">
      {/* ── Left sidebar: template list ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1 px-1">
          Templates
        </p>
        {ALL_TEMPLATE_KEYS.map((key) => {
          const t = getTemplate(key);
          const Icon = TEMPLATE_ICONS[key];
          const active = key === activeTemplate;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveTemplate(key);
                setRenderState("idle");
                setArtifactUrl(null);
                setRenderError(null);
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                active
                  ? "bg-[#c9a96e]/15 border border-[#c9a96e]/30 text-[#c9a96e]"
                  : "bg-white/5 border border-white/8 text-white/70 hover:bg-white/8"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{t.label}</div>
                <div className="text-[11px] text-white/40 truncate">{t.description}</div>
              </div>
            </button>
          );
        })}

        {/* Client selector */}
        <div className="mt-4">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">
            Brand Kit Source
          </p>
          <div className="relative">
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white/80 rounded-xl px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#c9a96e]/50"
            >
              <option value="__default__">Default props</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
          {selectedClient?.brandKit && (
            <p className="text-[11px] text-[#c9a96e]/70 mt-1.5 px-1">
              Brand kit applied — colors + fonts pulled from client.
            </p>
          )}
        </div>

        {/* Render info */}
        <div className="mt-4 bg-white/3 border border-white/8 rounded-xl p-3 text-[11px] text-white/40 space-y-1">
          <div className="flex justify-between">
            <span>Resolution</span>
            <span className="text-white/60">{entry.width} × {entry.height}</span>
          </div>
          <div className="flex justify-between">
            <span>FPS</span>
            <span className="text-white/60">{entry.fps}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="text-white/60">
              {(entry.durationInFrames / entry.fps).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* ── Right panel: preview + controls ─────────────────────────────────── */}
      <div className="flex flex-col gap-5 min-w-0">
        {/* Preview */}
        <div className={`w-full ${aspectClass} max-h-[520px] bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/8 flex items-center justify-center`}>
          <PlayerShell
            templateKey={activeTemplate}
            inputProps={derivedProps}
            controls
            loop
            autoPlay={false}
            style={{ height: "100%", width: "100%", borderRadius: 0 }}
          />
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleRender}
              disabled={renderState === "bundling" || renderState === "rendering"}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a96e] text-[#0d0d0d] rounded-xl font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {renderState === "bundling" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Bundling…
                </>
              ) : renderState === "rendering" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rendering {renderProgress}%
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Render to MP4
                </>
              )}
            </button>

            {renderState === "done" && artifactUrl && (
              <a
                href={artifactUrl}
                download
                className="flex items-center gap-2 px-5 py-2.5 bg-white/8 text-white/80 rounded-xl font-medium text-sm hover:bg-white/12 border border-white/10 transition-all"
              >
                <Download className="w-4 h-4" />
                Download MP4
              </a>
            )}

            {renderState === "done" && (
              <div className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Render complete
              </div>
            )}

            {renderState === "error" && (
              <p className="text-sm text-red-400">{renderError}</p>
            )}
          </div>

          {/* Progress bar */}
          {(renderState === "bundling" || renderState === "rendering") && (
            <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#c9a96e] rounded-full transition-all duration-500"
                style={{ width: renderState === "bundling" ? "15%" : `${Math.max(15, renderProgress)}%` }}
              />
            </div>
          )}
          {renderState === "bundling" && (
            <p className="text-[11px] text-white/40">
              First render: bundling Remotion compositions (~30s). Subsequent renders are faster.
            </p>
          )}
        </div>

        {/* Template info card */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-4">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
            About this template
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            {entry.description}
          </p>
          <p className="text-[11px] text-white/30 mt-3 border-t border-white/6 pt-3">
            Preview runs live in-browser. MP4 render uses Chromium headless — output saved to <code className="bg-white/8 px-1 rounded">/renders/</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
