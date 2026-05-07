import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const AnalyticsDashboard = dynamic(
  () => import("@/components/analytics/AnalyticsDashboard").then((m) => m.AnalyticsDashboard),
  { ssr: false },
);

export const metadata = { title: "Analytics · DR Branding OS" };

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Intelligence · M9"
        title="Analytics"
        description="Cross-client performance metrics, content velocity, and activity — all computed from real system data."
      />
      <AnalyticsDashboard />
    </PageContainer>
  );
}
