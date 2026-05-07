import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { WorkflowsBoard } from "@/components/workflows/WorkflowsBoard";

export const metadata = { title: "Workflow Command Center · DR Branding OS" };

export default function WorkflowsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Command Center"
        title="Workflow Command Center"
        description="Run repeatable production workflows across every client. Onboarding, weekly content, and approval — tracked step by step."
      />
      <WorkflowsBoard />
    </PageContainer>
  );
}
