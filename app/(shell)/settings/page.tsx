import dynamic from "next/dynamic";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
const SettingsPanel = dynamic(() => import("@/components/settings/SettingsPanel").then((m) => m.SettingsPanel), { ssr: false });
export const metadata = { title: "Settings · DR Branding OS" };
export default function SettingsPage() {
  return (<PageContainer><PageHeader eyebrow="System" title="Settings" description="Profile, appearance, and integrations. Local preferences are persisted in your browser." /><SettingsPanel /></PageContainer>);
}
