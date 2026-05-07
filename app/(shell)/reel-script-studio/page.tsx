import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReelScriptWorkspace } from "@/components/reel-script-studio/ReelScriptWorkspace";

export const metadata = { title: "Reel Script Studio · DR Branding OS" };

export default function ReelScriptStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Production"
        title="Reel Script Studio"
        description="Hook → scenes → CTA — structured reel scripts built around your client's brand voice."
      />
      <ReelScriptWorkspace />
    </PageContainer>
  );
}
