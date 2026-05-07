import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { N8nBuilderWorkspace } from "@/components/n8n-builder/N8nBuilderWorkspace";

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
