import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const ClientsBoard = dynamic(() => import("@/components/clients/ClientsBoard").then((m) => m.ClientsBoard), { ssr: false });
export const metadata = { title: "Clients · DR Branding OS" };
export default function ClientsPage() {
  return (<PageContainer><PageHeader eyebrow="Workspace" title="Clients" description="Every client you manage. Brand kit, brief, content history, and active workflows live here." /><ClientsBoard /></PageContainer>);
}
