import { PageContainer } from "@/components/shared/PageContainer";
import { ClientDetailView } from "@/components/clients/ClientDetailView";

export const metadata = { title: "Client · DR Branding OS" };

export default function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  return (
    <PageContainer>
      <ClientDetailView clientId={params.clientId} />
    </PageContainer>
  );
}
