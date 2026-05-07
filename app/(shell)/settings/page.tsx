import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

export const metadata = { title: "Settings · DR Branding OS" };

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="System"
        title="Settings"
        description="Profile, appearance, and integrations. Local preferences are persisted in your browser."
      />
      <SettingsPanel />
    </PageContainer>
  );
}
