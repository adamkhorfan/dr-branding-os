import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";

const AssetManagerWorkspace = dynamic(
  () =>
    import("@/components/assets/AssetManagerWorkspace").then(
      (m) => m.AssetManagerWorkspace
    ),
  { ssr: false }
);

export const metadata = { title: "Brand Assets · DR Branding OS" };

export default function AssetsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Workspace · M14"
        title="Brand Assets"
        description="Upload and manage logos, images, fonts, and files for every client."
      />
      <AssetManagerWorkspace />
    </PageContainer>
  );
}
