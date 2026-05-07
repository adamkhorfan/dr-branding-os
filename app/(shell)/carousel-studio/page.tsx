import { PageContainer } from "@/components/shared/PageContainer";
import { PageHeader } from "@/components/shared/PageHeader";
import { CarouselStudioWorkspace } from "@/components/carousel-studio/CarouselStudioWorkspace";

export const metadata = { title: "Carousel Studio · DR Branding OS" };

export default function CarouselStudioPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Production"
        title="Carousel Studio"
        description="Slide-by-slide carousel structure — copy, visual direction, and CTA — saved to the client library."
      />
      <CarouselStudioWorkspace />
    </PageContainer>
  );
}
