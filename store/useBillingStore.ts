"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Invoice, InvoiceLineItem, InvoiceStatus, ClientRetainer } from "@/types/billing";

interface BillingState {
  invoices: Invoice[];
  retainers: ClientRetainer[];
  loaded: boolean;

  load: () => void;
  createInvoice: (clientId: string, lineItems: InvoiceLineItem[]) => Invoice;
  updateStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  setRetainer: (retainer: ClientRetainer) => void;
  getClientInvoices: (clientId: string) => Invoice[];
}

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      invoices: [],
      retainers: [],
      loaded: false,

      load() {
        set({ loaded: true });
      },

      createInvoice(clientId, lineItems) {
        const state = get();
        const count = state.invoices.length + 1;
        const invoiceNumber = `INV-${String(count).padStart(4, "0")}`;

        const now = new Date().toISOString();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const resolvedItems = lineItems.map((item) => ({
          ...item,
          total: item.quantity * item.unitPrice,
        }));

        const subtotal = resolvedItems.reduce((sum, item) => sum + item.total, 0);
        const tax = 0;
        const total = subtotal + tax;

        const invoice: Invoice = {
          id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          clientId,
          invoiceNumber,
          status: "draft",
          lineItems: resolvedItems,
          subtotal,
          tax,
          total,
          currency: "USD",
          issuedAt: now,
          dueAt: dueDate.toISOString(),
          createdAt: now,
          updatedAt: now,
        };

        set((s) => ({ invoices: [invoice, ...s.invoices] }));
        return invoice;
      },

      updateStatus(id, status) {
        const now = new Date().toISOString();
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id
              ? {
                  ...inv,
                  status,
                  updatedAt: now,
                  ...(status === "paid" ? { paidAt: now } : {}),
                }
              : inv,
          ),
        }));
      },

      deleteInvoice(id) {
        set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) }));
      },

      setRetainer(retainer) {
        set((s) => {
          const existing = s.retainers.findIndex(
            (r) => r.clientId === retainer.clientId,
          );
          if (existing >= 0) {
            const updated = [...s.retainers];
            updated[existing] = retainer;
            return { retainers: updated };
          }
          return { retainers: [...s.retainers, retainer] };
        });
      },

      getClientInvoices(clientId) {
        return get().invoices.filter((inv) => inv.clientId === clientId);
      },
    }),
    {
      name: "dr-branding-billing",
      partialize: (s) => ({
        invoices: s.invoices,
        retainers: s.retainers,
      }),
    },
  ),
);
