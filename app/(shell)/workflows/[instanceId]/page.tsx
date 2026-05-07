import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";

const WorkflowDetail = dynamic(
  () => import("@/components/workflows/WorkflowDetail").then((m) => m.WorkflowDetail),
  { ssr: false },
);

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
