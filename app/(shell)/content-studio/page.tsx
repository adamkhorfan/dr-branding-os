import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentStudioWorkspace } from "@/components/content-studio/ContentStudioWorkspace";

export const metadata = { title: "Content Studio · DR Branding OS" };

export default function ContentStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Production"
        title="Content Studio"
        description="Posts, captions, and stories — generated on-brand and saved to the client library."
      />
      <ContentStudioWorkspace />
    </PageContainer>
  );
}
