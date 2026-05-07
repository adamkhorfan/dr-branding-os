import type { ID, ISODate, Timestamps } from "./common";

export interface ReportKpi {
  label: string;
  value: number | string;
  delta?: number;
  unit?: string;
}

export interface Report extends Timestamps {
  id: ID;
  clientId: ID;
  month: string; // YYYY-MM
  kpis: ReportKpi[];
  highlights: string[];
  contentSummary?: string;
  recommendations: string[];
  generatedAt: ISODate;
}
