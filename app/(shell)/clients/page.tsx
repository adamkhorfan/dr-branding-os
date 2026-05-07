import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ClientsBoard } from "@/components/clients/ClientsBoard";

export const metadata = { title: "Clients · DR Branding OS" };

export default function ClientsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Workspace"
        title="Clients"
        description="Every client you manage. Brand kit, brief, content history, and active workflows live here."
      />
      <ClientsBoard />
    </PageContainer>
  );
}
