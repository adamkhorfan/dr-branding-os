import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const MessagesWorkspace = dynamic(() => import("@/components/messages/MessagesWorkspace").then((m) => m.MessagesWorkspace), { ssr: false });
export const metadata = { title: "Client Messages · DR Branding OS" };
export default function MessagesPage() {
  return (<PageContainer><PageHeader eyebrow="Operations · M6" title="Client Messages" description="Threaded conversations per client — outbound, inbound, and internal notes all in one place." /><MessagesWorkspace /></PageContainer>);
}
