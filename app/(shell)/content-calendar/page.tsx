import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarView } from "@/components/content-calendar/CalendarView";

export const metadata = { title: "Content Calendar · DR Branding OS" };

export default function ContentCalendarPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Operations · M5"
        title="Content Calendar"
        description="Cross-client month view — all scheduled and created content in one calendar."
      />
      <CalendarView />
    </PageContainer>
  );
}
