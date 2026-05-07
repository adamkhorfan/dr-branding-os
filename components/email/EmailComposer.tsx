"use client";

import { useState } from "react";
import { Send, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClientsStore } from "@/store/useClientsStore";
import {
  approvalRequestEmail,
  weeklyUpdateEmail,
  reportReadyEmail,
} from "@/lib/email/templates";

export interface EmailComposerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultHtml?: string;
  clientId?: string;
}

type SendState = "idle" | "loading" | "success" | "error" | "no-key";

export function EmailComposer({
  open,
  onOpenChange,
  defaultTo = "",
  defaultSubject = "",
  defaultHtml = "",
  clientId,
}: EmailComposerProps) {
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [html, setHtml] = useState(defaultHtml);
  const [preview, setPreview] = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const clients = useClientsStore((s) => s.clients);
  const client = clientId ? clients.find((c) => c.id === clientId) : undefined;

  const portalUrl =
    typeof window !== "undefined" && clientId
      ? `${window.location.origin}/portal/${clientId}`
      : clientId
        ? `/portal/${clientId}`
        : "";

  // ─── Quick templates ───────────────────────────────────────────────────────

  function applyApprovalTemplate() {
    const clientName = client?.name ?? "there";
    setSubject("Action required: content review");
    setHtml(
      approvalRequestEmail({
        clientName,
        itemTitle: "New content piece",
        itemType: "Social post",
        portalUrl,
      }),
    );
  }

  function applyWeeklyTemplate() {
    const clientName = client?.name ?? "there";
    setSubject("Your weekly marketing update");
    setHtml(
      weeklyUpdateEmail({
        clientName,
        publishedCount: 0,
        pendingCount: 0,
        activeCampaigns: 0,
        portalUrl,
      }),
    );
  }

  function applyReportTemplate() {
    const clientName = client?.name ?? "there";
    const month = new Date().toLocaleString("default", { month: "long", year: "numeric" });
    setSubject(`Your ${month} performance report is ready`);
    setHtml(
      reportReadyEmail({
        clientName,
        month,
        highlights: [
          "Content published this month",
          "Audience engagement summary",
          "Campaign performance overview",
        ],
        portalUrl,
      }),
    );
  }

  // ─── Send ──────────────────────────────────────────────────────────────────

  async function handleSend() {
    if (!to || !subject || !html) return;
    setSendState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      });

      const data = await res.json() as { sent: boolean; message?: string; id?: string };

      if (data.sent) {
        setSendState("success");
      } else if (data.message?.includes("RESEND_API_KEY")) {
        setSendState("no-key");
      } else {
        setSendState("error");
        setErrorMsg(data.message ?? "Failed to send.");
      }
    } catch (err) {
      setSendState("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error.");
    }
  }

  function handleClose(v: boolean) {
    onOpenChange(v);
    if (!v) {
      setSendState("idle");
      setErrorMsg("");
      setPreview(false);
    }
  }

  const isLoading = sendState === "loading";
  const isSuccess = sendState === "success";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Compose email</DialogTitle>
          <DialogDescription>
            {client ? `To: ${client.name}` : "Send an email to your client"}
          </DialogDescription>
        </DialogHeader>

        {/* No API key notice */}
        {sendState === "no-key" && (
          <div className="flex items-start gap-2.5 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2.5 text-sm text-yellow-400">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <span>Add <code className="font-mono bg-yellow-500/10 px-1 rounded">RESEND_API_KEY</code> to <code className="font-mono bg-yellow-500/10 px-1 rounded">.env.local</code> to enable email sending.</span>
          </div>
        )}

        {/* Success notice */}
        {isSuccess && (
          <div className="flex items-center gap-2.5 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Email sent successfully.
          </div>
        )}

        {/* Error notice */}
        {sendState === "error" && errorMsg && (
          <div className="flex items-start gap-2.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          {/* Quick templates */}
          <div>
            <p className="text-2xs uppercase tracking-[0.08em] text-fg-subtle mb-2">Quick templates</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-xs h-7 text-fg-muted border border-border" onClick={applyApprovalTemplate}>
                Approval Request
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-fg-muted border border-border" onClick={applyWeeklyTemplate}>
                Weekly Update
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-fg-muted border border-border" onClick={applyReportTemplate}>
                Report Ready
              </Button>
            </div>
          </div>

          {/* To */}
          <div className="space-y-1.5">
            <label className="text-xs text-fg-muted font-medium">To</label>
            <Input
              type="email"
              placeholder="client@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={isLoading || isSuccess}
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs text-fg-muted font-medium">Subject</label>
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading || isSuccess}
            />
          </div>

          {/* HTML Body + preview toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-fg-muted font-medium">HTML body</label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1.5 text-xs text-fg-muted px-2"
                onClick={() => setPreview((p) => !p)}
              >
                {preview ? (
                  <><EyeOff className="h-3.5 w-3.5" /> Edit</>
                ) : (
                  <><Eye className="h-3.5 w-3.5" /> Preview</>
                )}
              </Button>
            </div>

            {preview ? (
              <div
                className="min-h-[220px] max-h-[340px] overflow-auto rounded-md border border-border bg-white"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <Textarea
                className="min-h-[220px] font-mono text-xs"
                placeholder="<p>Your email HTML...</p>"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                disabled={isLoading || isSuccess}
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => handleClose(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleSend}
            disabled={isLoading || isSuccess || !to || !subject || !html}
          >
            {isLoading ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
            ) : isSuccess ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Sent</>
            ) : (
              <><Send className="h-3.5 w-3.5" /> Send email</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
