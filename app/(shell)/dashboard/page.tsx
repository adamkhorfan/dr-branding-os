import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";

const LiveDashboard = dynamic(
  () => import("@/components/dashboard/LiveDashboard").then((m) => m.LiveDashboard),
  { ssr: false },
);

export const metadata = { title: "Dashboard · DR Branding OS" };

export default function DashboardPage() {
  return (
    <PageContainer>
      <LiveDashboard />
    </PageContainer>
  );
}
