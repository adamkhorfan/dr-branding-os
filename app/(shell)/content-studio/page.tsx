import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const ContentStudioWorkspace = dynamic(() => import("@/components/content-studio/ContentStudioWorkspace").then((m) => m.ContentStudioWorkspace), { ssr: false });
export const metadata = { title: "Content Studio · DR Branding OS" };
export default function ContentStudioPage() {
  return (<PageContainer><PageHeader eyebrow="Production" title="Content Studio" description="Posts, captions, and stories — generated on-brand and saved to the client library." /><ContentStudioWorkspace /></PageContainer>);
}
