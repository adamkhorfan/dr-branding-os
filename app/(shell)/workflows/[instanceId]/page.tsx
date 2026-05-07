import { PageContainer } from "@/components/shared/PageContainer";
import { WorkflowDetail } from "@/components/workflows/WorkflowDetail";

export const metadata = { title: "Workflow · DR Branding OS" };

export default function WorkflowInstancePage({
  params,
}: {
  params: { instanceId: string };
}) {
  return (
    <PageContainer>
      <WorkflowDetail instanceId={params.instanceId} />
    </PageContainer>
  );
}
