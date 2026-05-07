import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";

const ClientDetailView = dynamic(
  () => import("@/components/clients/ClientDetailView").then((m) => m.ClientDetailView),
  { ssr: false },
);

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
