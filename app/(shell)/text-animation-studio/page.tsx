import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { TextAnimationWorkspace } from "@/components/text-animation-studio/TextAnimationWorkspace";

export const metadata = { title: "Text Animation Studio · DR Branding OS" };

export default function TextAnimationStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Motion · M5"
        title="Text Animation Studio"
        description="Quote videos, title animations, and typography motion — planned, spec'd, and saved per client."
      />
      <TextAnimationWorkspace />
    </PageContainer>
  );
}
