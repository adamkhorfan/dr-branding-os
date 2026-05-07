import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const BillingDashboard = dynamic(
  () => import("@/components/billing/BillingDashboard").then((m) => m.BillingDashboard),
  { ssr: false },
);

export const metadata = { title: "Billing · DR Branding OS" };

export default function BillingPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Operations · M18"
        title="Billing & Invoicing"
        description="Track retainers, manage invoices, and monitor revenue across all clients."
      />
      <BillingDashboard />
    </PageContainer>
  );
}
