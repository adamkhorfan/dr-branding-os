import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const MotionTemplateStudio = dynamic(
  () => import("@/components/motion-template-studio/MotionTemplateStudio").then((m) => m.MotionTemplateStudio),
  { ssr: false },
);

export const metadata = { title: "Motion Template Studio · DR Branding OS" };

export default function MotionTemplateStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Motion · Remotion Engine"
        title="Motion Template Studio"
        description="Coded, branded video templates. Preview live in-browser. Render to MP4 with one click."
      />
      <MotionTemplateStudio />
    </PageContainer>
  );
}
