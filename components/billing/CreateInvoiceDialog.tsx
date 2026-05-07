"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { useBillingStore } from "@/store/useBillingStore";
import { useClientsStore } from "@/store/useClientsStore";
import type { InvoiceLineItem } from "@/types/billing";

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

interface DraftLineItem {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

function makeDraftItem(): DraftLineItem {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    description: "",
    quantity: "1",
    unitPrice: "",
  };
}

function parseCents(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const { clients } = useClientsStore();
  const createInvoice = useBillingStore((s) => s.createInvoice);

  const [clientId, setClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [draftItems, setDraftItems] = useState<DraftLineItem[]>([makeDraftItem()]);

  const activeClients = clients.filter((c) => c.status !== "archived");

  function addLineItem() {
    setDraftItems((prev) => [...prev, makeDraftItem()]);
  }

  function removeLineItem(id: string) {
    setDraftItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItem(id: string, field: keyof Omit<DraftLineItem, "id">, value: string) {
    setDraftItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  function getItemTotal(item: DraftLineItem): number {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseCents(item.unitPrice);
    return Math.round(qty * price);
  }

  const subtotal = draftItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const tax = 0;
  const total = subtotal + tax;

  function handleSubmit() {
    if (!clientId) return;

    const lineItems: InvoiceLineItem[] = draftItems
      .filter((item) => item.description.trim() !== "")
      .map((item) => {
        const qty = parseFloat(item.quantity) || 1;
        const unitPrice = parseCents(item.unitPrice);
        return {
          id: item.id,
          description: item.description.trim(),
          quantity: qty,
          unitPrice,
          total: Math.round(qty * unitPrice),
        };
      });

    createInvoice(clientId, lineItems);
    handleClose();
  }

  function handleClose() {
    setClientId("");
    setNotes("");
    setDraftItems([makeDraftItem()]);
    onOpenChange(false);
  }

  const canSubmit = clientId !== "" && draftItems.some((item) => item.description.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>
            Select a client, add line items, and create a draft invoice.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Client selector */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invoice-client">Client</Label>
            <select
              id="invoice-client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-bg-inset px-3 py-1.5 text-sm text-fg focus-visible:outline-none focus-visible:border-accent/50 focus-visible:ring-1 focus-visible:ring-accent/40"
            >
              <option value="">Select a client…</option>
              {activeClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Line items table */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button variant="ghost" size="sm" onClick={addLineItem} type="button">
                <Plus className="h-3.5 w-3.5" />
                Add item
              </Button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_80px_120px_80px_32px] gap-2 px-1">
              <span className="text-2xs uppercase tracking-[0.08em] text-fg-subtle font-medium">Description</span>
              <span className="text-2xs uppercase tracking-[0.08em] text-fg-subtle font-medium">Qty</span>
              <span className="text-2xs uppercase tracking-[0.08em] text-fg-subtle font-medium">Unit Price ($)</span>
              <span className="text-2xs uppercase tracking-[0.08em] text-fg-subtle font-medium text-right">Total</span>
              <span />
            </div>

            <div className="flex flex-col gap-2">
              {draftItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_80px_120px_80px_32px] gap-2 items-center">
                  <Input
                    placeholder="Service or item description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                  />
                  <span className="text-sm text-fg-muted text-right tabular-nums">
                    {formatCents(getItemTotal(item))}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    className="text-fg-subtle hover:text-danger"
                    onClick={() => removeLineItem(item.id)}
                    disabled={draftItems.length === 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invoice-notes">Notes (optional)</Label>
            <Textarea
              id="invoice-notes"
              placeholder="Payment terms, additional context…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[72px]"
            />
          </div>

          {/* Summary */}
          <div className="surface rounded-md p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">Subtotal</span>
              <span className="text-fg tabular-nums">{formatCents(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-fg-muted">Tax (0%)</span>
              <span className="text-fg tabular-nums">{formatCents(tax)}</span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-border pt-2 mt-1">
              <span className="font-medium text-fg">Total</span>
              <span className="font-semibold text-fg tabular-nums">{formatCents(total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} type="button">
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
