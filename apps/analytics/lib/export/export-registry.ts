import type { WidgetId } from "@/components/widgets/widget-registry";
import { WIDGET_REGISTRY } from "@/components/widgets/widget-registry";
import type { HazardCounts } from "@/lib/queries/fetch-hazard-counts";
import { buildCsvContent } from "@/lib/export/csv-utils";

export type DashboardExportData = {
  counts: HazardCounts;
  exportedAt: string;
};

export type CsvExportRow = {
  label: string;
  value: string | number;
};

type ExportProvider = (data: DashboardExportData) => CsvExportRow[];

const EXPORT_PROVIDERS: Partial<Record<WidgetId, ExportProvider>> = {
  "total-hazards": (data) => [
    { label: "Total Count", value: data.counts.total },
    { label: "Scope", value: "Unresolved, In Progress, and Resolved" },
  ],
  "total-unresolved": (data) => [
    { label: "Total Count", value: data.counts.unresolved },
    { label: "Scope", value: "Unresolved status only" },
  ],
  "total-in-progress": (data) => [
    { label: "Total Count", value: data.counts.inProgress },
    { label: "Scope", value: "In Progress status only" },
  ],
};

export function getExportProviders(): Partial<Record<WidgetId, ExportProvider>> {
  return EXPORT_PROVIDERS;
}

export function buildDashboardCsv(data: DashboardExportData): string {
  const rows: string[][] = [];

  for (const widget of WIDGET_REGISTRY) {
    if (!widget.enabled) {
      continue;
    }

    const provider = EXPORT_PROVIDERS[widget.id];
    if (!provider) {
      continue;
    }

    for (const exportRow of provider(data)) {
      rows.push([widget.title, exportRow.label, String(exportRow.value)]);
    }
  }

  rows.push(["Dashboard Export", "Exported At", data.exportedAt]);

  return buildCsvContent(["Widget", "Metric", "Value"], rows);
}
