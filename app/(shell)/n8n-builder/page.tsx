import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const N8nBuilderWorkspace = dynamic(
  () => import("@/components/n8n-builder/N8nBuilderWorkspace").then((m) => m.N8nBuilderWorkspace),
  { ssr: false },
);

export const metadata = { title: "n8n Workflow Builder · DR Branding OS" };

export default function N8nBuilderPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Automation · M7"
        title="n8n Workflow Builder"
        description="Design automation flows with triggers, actions, and conditions. Export to n8n JSON and import directly into your n8n instance."
      />
      <N8nBuilderWorkspace />
    </PageContainer>
  );
}
