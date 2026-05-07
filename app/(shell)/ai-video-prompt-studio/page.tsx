import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { AiVideoPromptWorkspace } from "@/components/ai-video-prompt-studio/AiVideoPromptWorkspace";

export const metadata = { title: "AI Video Prompt Studio · DR Branding OS" };

export default function AiVideoPromptStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Production · M5"
        title="AI Video Prompt Studio"
        description="Build cinematic prompts for Runway, Luma, Kling, and Sora — with shot lists and brand-aligned style direction."
      />
      <AiVideoPromptWorkspace />
    </PageContainer>
  );
}
