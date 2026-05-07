import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { MotionVideoWorkspace } from "@/components/motion-video-studio/MotionVideoWorkspace";

export const metadata = { title: "Motion Video Studio · DR Branding OS" };

export default function MotionVideoStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Motion · M5"
        title="Motion Video Studio"
        description="Scene-by-scene storyboard planner for branded animated videos — motion direction, timing, and copy."
      />
      <MotionVideoWorkspace />
    </PageContainer>
  );
}
