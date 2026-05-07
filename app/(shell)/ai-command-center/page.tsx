import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";

const AiCommandCenter = dynamic(
  () => import("@/components/ai-command-center/AiCommandCenter").then((m) => m.AiCommandCenter),
  { ssr: false },
);

export const metadata = { title: "AI Command Center · DR Branding OS" };

export default function AiCommandCenterPage() {
  return (
    <PageContainer className="py-4 md:py-4 space-y-0">
      <AiCommandCenter />
    </PageContainer>
  );
}
