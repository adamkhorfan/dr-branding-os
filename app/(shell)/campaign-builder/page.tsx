import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CampaignBuilderWorkspace } from "@/components/campaign-builder/CampaignBuilderWorkspace";

export const metadata = { title: "Campaign Builder · DR Branding OS" };

export default function CampaignBuilderPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Operations · M5"
        title="Campaign Builder"
        description="Plan multi-asset campaigns with objectives, milestones, timelines, and budgets — per client."
      />
      <CampaignBuilderWorkspace />
    </PageContainer>
  );
}
