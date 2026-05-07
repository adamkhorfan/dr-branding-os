import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { StrategyLabWorkspace } from "@/components/strategy-lab/StrategyLabWorkspace";

export const metadata = { title: "Strategy Lab · DR Branding OS" };

export default function StrategyLabPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Strategy"
        title="Strategy Lab"
        description="Positioning, USPs, content pillars, hooks, and CTAs — generated from client brand data."
      />
      <StrategyLabWorkspace />
    </PageContainer>
  );
}
