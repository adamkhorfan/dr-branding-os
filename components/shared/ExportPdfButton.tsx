"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportPdfButtonProps {
  htmlContent: string;
  filename: string;
  label?: string;
}

export function ExportPdfButton({
  htmlContent,
  filename,
  label = "Export PDF",
}: ExportPdfButtonProps) {
  function handleExport() {
    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();

    // Give browser time to render before triggering print
    setTimeout(() => {
      newWindow.document.title = filename;
      newWindow.print();
    }, 500);
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport}>
      <Download className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
