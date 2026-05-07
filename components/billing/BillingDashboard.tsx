"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Plus,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useBillingStore } from "@/store/useBillingStore";
import { useClientsStore } from "@/store/useClientsStore";
import { InvoiceCard } from "@/components/billing/InvoiceCard";
import { CreateInvoiceDialog } from "@/components/billing/CreateInvoiceDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InvoiceStatus, BillingFrequency } from "@/types/billing";

type FilterTab = "all" | InvoiceStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "paid", label: "Paid" },
  { key: "overdue", label: "Overdue" },
];

function formatCents(cents: number): string {
  if (cents >= 100000) {
    return `$${(cents / 100000).toFixed(1)}k`;
  }
  return `$${(cents / 100).toFixed(2)}`;
}

function formatCentsFull(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="surface rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.08em] font-medium text-fg-subtle">
          {label}
        </span>
        <span className="text-fg-muted">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-fg tabular-nums">{value}</p>
        {sub && <p className="text-xs text-fg-subtle mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function BillingDashboard() {
  const {
    invoices,
    retainers,
    loaded,
    load,
    updateStatus,
    deleteInvoice,
    setRetainer,
  } = useBillingStore();

  const { clients, loaded: clientsLoaded, load: loadClients } = useClientsStore();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRetainerId, setEditingRetainerId] = useState<string | null>(null);
  const [editRetainerAmount, setEditRetainerAmount] = useState("");

  useEffect(() => {
    if (!loaded) load();
    if (!clientsLoaded) loadClients();
  }, [loaded, clientsLoaded, load, loadClients]);

  // ── KPI calculations ─────────────────────────────────────────────────
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const paidThisMonth = invoices
    .filter(
      (inv) =>
        inv.status === "paid" &&
        inv.paidAt &&
        new Date(inv.paidAt) >= startOfMonth,
    )
    .reduce((sum, inv) => sum + inv.total, 0);

  const outstanding = invoices
    .filter((inv) => inv.status === "sent")
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  // ── Filtered invoices ────────────────────────────────────────────────
  const filtered =
    activeTab === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === activeTab);

  // ── Active retainers ─────────────────────────────────────────────────
  const activeRetainers = retainers.filter((r) => r.active);

  function getClientName(clientId: string): string {
    return clients.find((c) => c.id === clientId)?.name ?? clientId;
  }

  function startEditRetainer(clientId: string, currentAmount: number) {
    setEditingRetainerId(clientId);
    setEditRetainerAmount((currentAmount / 100).toFixed(2));
  }

  function saveRetainer(clientId: string) {
    const existing = retainers.find((r) => r.clientId === clientId);
    if (!existing) return;
    const newAmount = Math.round(parseFloat(editRetainerAmount) * 100);
    if (isNaN(newAmount)) return;
    setRetainer({ ...existing, monthlyAmount: newAmount });
    setEditingRetainerId(null);
  }

  function cancelEditRetainer() {
    setEditingRetainerId(null);
    setEditRetainerAmount("");
  }

  const FREQUENCY_LABELS: Record<BillingFrequency, string> = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    project: "Per Project",
    "one-time": "One-Time",
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Revenue KPIs */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.1em] font-medium text-fg-subtle mb-3">
          Revenue Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Invoiced"
            value={formatCents(totalInvoiced)}
            icon={<DollarSign className="h-4 w-4" />}
            sub="All time"
          />
          <StatCard
            label="Paid This Month"
            value={formatCents(paidThisMonth)}
            icon={<TrendingUp className="h-4 w-4" />}
            sub={now.toLocaleString("en-US", { month: "long", year: "numeric" })}
          />
          <StatCard
            label="Outstanding"
            value={formatCents(outstanding)}
            icon={<Clock className="h-4 w-4" />}
            sub="Sent, awaiting payment"
          />
          <StatCard
            label="Overdue"
            value={formatCents(overdue)}
            icon={<AlertTriangle className="h-4 w-4" />}
            sub={overdue > 0 ? "Requires attention" : "All clear"}
          />
        </div>
      </section>

      {/* Retainer Summary */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.1em] font-medium text-fg-subtle mb-3">
          Active Retainers
        </h2>
        {activeRetainers.length === 0 ? (
          <div className="surface rounded-lg p-6 text-center text-sm text-fg-muted">
            No active retainers. Add one via client billing settings.
          </div>
        ) : (
          <div className="surface rounded-lg divide-y divide-border">
            {activeRetainers.map((retainer) => (
              <div
                key={retainer.clientId}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg truncate">
                    {getClientName(retainer.clientId)}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {FREQUENCY_LABELS[retainer.frequency]} · Next:{" "}
                    {new Date(retainer.nextBillingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {editingRetainerId === retainer.clientId ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-fg-muted">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editRetainerAmount}
                      onChange={(e) => setEditRetainerAmount(e.target.value)}
                      className="w-28 h-8 text-sm"
                    />
                    <span className="text-xs text-fg-subtle">/mo</span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => saveRetainer(retainer.clientId)}
                    >
                      <Check className="h-3.5 w-3.5 text-success" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={cancelEditRetainer}
                    >
                      <X className="h-3.5 w-3.5 text-fg-muted" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-fg tabular-nums">
                      {formatCentsFull(retainer.monthlyAmount)}
                      <span className="text-fg-subtle font-normal text-xs">/mo</span>
                    </span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        startEditRetainer(retainer.clientId, retainer.monthlyAmount)
                      }
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit retainer</span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Invoices List */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-3">
          <h2 className="text-xs uppercase tracking-[0.1em] font-medium text-fg-subtle">
            Invoices
          </h2>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Invoice
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-4">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? invoices.length
                : invoices.filter((inv) => inv.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.key
                    ? "border-accent text-fg"
                    : "border-transparent text-fg-muted hover:text-fg",
                ].join(" ")}
              >
                {tab.label}
                <span
                  className={[
                    "ml-1.5 tabular-nums",
                    activeTab === tab.key ? "text-accent" : "text-fg-subtle",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="surface rounded-lg p-8 text-center text-sm text-fg-muted">
            {activeTab === "all"
              ? "No invoices yet. Create your first invoice to get started."
              : `No ${activeTab} invoices.`}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                clientName={getClientName(invoice.clientId)}
                onStatusChange={updateStatus}
                onDelete={deleteInvoice}
              />
            ))}
          </div>
        )}
      </section>

      <CreateInvoiceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
