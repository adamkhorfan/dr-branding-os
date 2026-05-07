"use client";

import { useReportsStore } from "@/store/useReportsStore";
import { useClientsStore } from "@/store/useClientsStore";
import { generateReportHtml } from "@/lib/pdf/generateReportHtml";
import { ExportPdfButton } from "@/components/shared/ExportPdfButton";

interface ReportExportButtonProps {
  reportId: string;
  clientId: string;
}

export function ReportExportButton({ reportId, clientId }: ReportExportButtonProps) {
  const report = useReportsStore((s) => s.reports.find((r) => r.id === reportId));
  const client = useClientsStore((s) => s.clients.find((c) => c.id === clientId));

  if (!report || !client) return null;

  const htmlContent = generateReportHtml(report, client);
  const filename = `${client.name}-report-${report.month}.pdf`;

  return (
    <ExportPdfButton
      htmlContent={htmlContent}
      filename={filename}
      label="Export PDF"
    />
  );
}
