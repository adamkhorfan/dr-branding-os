"use client";

import type { Client } from "@/types/client";
import { generateBriefHtml } from "@/lib/pdf/generateBriefHtml";
import { ExportPdfButton } from "@/components/shared/ExportPdfButton";

interface BriefExportButtonProps {
  client: Client;
}

export function BriefExportButton({ client }: BriefExportButtonProps) {
  const htmlContent = generateBriefHtml(client);
  const filename = `${client.name}-brand-brief.pdf`;

  return (
    <ExportPdfButton
      htmlContent={htmlContent}
      filename={filename}
      label="Export brief"
    />
  );
}
