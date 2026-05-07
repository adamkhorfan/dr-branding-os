import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const ReelScriptWorkspace = dynamic(() => import("@/components/reel-script-studio/ReelScriptWorkspace").then((m) => m.ReelScriptWorkspace), { ssr: false });
export const metadata = { title: "Reel Script Studio · DR Branding OS" };
export default function ReelScriptStudioPage() {
  return (<PageContainer><PageHeader eyebrow="Production" title="Reel Script Studio" description="Hook to scenes to CTA — structured reel scripts built around your client's brand voice." /><ReelScriptWorkspace /></PageContainer>);
}
