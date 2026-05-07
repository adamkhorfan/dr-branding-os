import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const MotionVideoWorkspace = dynamic(() => import("@/components/motion-video-studio/MotionVideoWorkspace").then((m) => m.MotionVideoWorkspace), { ssr: false });
export const metadata = { title: "Motion Video Studio · DR Branding OS" };
export default function MotionVideoStudioPage() {
  return (<PageContainer><PageHeader eyebrow="Motion · M5" title="Motion Video Studio" description="Scene-by-scene storyboard planner for branded animated videos — motion direction, timing, and copy." /><MotionVideoWorkspace /></PageContainer>);
}
