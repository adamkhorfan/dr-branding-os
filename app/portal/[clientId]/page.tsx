import dynamic from "next/dynamic";

const ClientPortalView = dynamic(
  () => import("@/components/portal/ClientPortalView").then((m) => m.ClientPortalView),
  { ssr: false },
);

export const metadata = { title: "Client Portal · DR Branding OS" };

export default function PortalPage({ params }: { params: { clientId: string } }) {
  return <ClientPortalView clientId={params.clientId} />;
}
