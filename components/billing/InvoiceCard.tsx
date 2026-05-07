"use client";

import { MoreHorizontal, Trash2, Send, CheckCircle, AlertCircle } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/billing/InvoiceStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Invoice, InvoiceStatus } from "@/types/billing";

interface InvoiceCardProps {
  invoice: Invoice;
  clientName: string;
  onStatusChange: (id: string, status: InvoiceStatus) => void;
  onDelete: (id: string) => void;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function InvoiceCard({
  invoice,
  clientName,
  onStatusChange,
  onDelete,
}: InvoiceCardProps) {
  const { lineItems } = invoice;
  const visibleItems = lineItems.slice(0, 3);
  const extraCount = lineItems.length - visibleItems.length;

  return (
    <div className="surface rounded-lg p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-fg font-mono">
              {invoice.invoiceNumber}
            </span>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-xs text-fg-muted mt-0.5 truncate">{clientName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-base font-semibold text-fg">
            {formatCents(invoice.total)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-fg-muted">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Invoice actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "sent")}>
                <Send className="h-3.5 w-3.5" />
                Mark as Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "paid")}>
                <CheckCircle className="h-3.5 w-3.5" />
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(invoice.id, "overdue")}>
                <AlertCircle className="h-3.5 w-3.5" />
                Mark as Overdue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger focus:text-danger focus:bg-danger/10"
                onClick={() => onDelete(invoice.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Line items */}
      {visibleItems.length > 0 && (
        <div className="space-y-1">
          {visibleItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs">
              <span className="text-fg-muted truncate max-w-[60%]">
                {item.description}
                <span className="text-fg-subtle ml-1">×{item.quantity}</span>
              </span>
              <span className="text-fg-muted shrink-0">{formatCents(item.total)}</span>
            </div>
          ))}
          {extraCount > 0 && (
            <p className="text-xs text-fg-subtle">+{extraCount} more item{extraCount > 1 ? "s" : ""}</p>
          )}
        </div>
      )}

      {/* Dates */}
      <div className="flex items-center gap-4 text-xs text-fg-subtle border-t border-border pt-2">
        <span>
          Issued: <span className="text-fg-muted">{formatDate(invoice.issuedAt)}</span>
        </span>
        <span>
          Due: <span className="text-fg-muted">{formatDate(invoice.dueAt)}</span>
        </span>
        {invoice.paidAt && (
          <span>
            Paid: <span className="text-success">{formatDate(invoice.paidAt)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
