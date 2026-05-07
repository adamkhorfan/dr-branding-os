import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const ReportsWorkspace = dynamic(() => import("@/components/reports/ReportsWorkspace").then((m) => m.ReportsWorkspace), { ssr: false });
export const metadata = { title: "Reports · DR Branding OS" };
export default function ReportsPage() {
  return (<PageContainer><PageHeader eyebrow="Operations · M6" title="Reports" description="Monthly client reports generated from real system data — content, workflows, campaigns, and recommendations." /><ReportsWorkspace /></PageContainer>);
}
