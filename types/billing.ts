export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type BillingFrequency = "monthly" | "quarterly" | "project" | "one-time";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;    // in USD cents
  total: number;        // quantity * unitPrice
}

export interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string;   // e.g. "INV-0042"
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;        // sum of line totals (cents)
  tax: number;             // tax amount (cents)
  total: number;           // subtotal + tax (cents)
  currency: string;        // "USD"
  issuedAt: string;        // ISO date
  dueAt: string;           // ISO date
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientRetainer {
  clientId: string;
  monthlyAmount: number;   // cents
  frequency: BillingFrequency;
  nextBillingDate: string; // ISO date
  active: boolean;
}
