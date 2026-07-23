import { NextResponse } from "next/server";
import { buildDashboardCsv } from "@/lib/export/export-registry";
import { fetchHazardCounts } from "@/lib/queries/fetch-hazard-counts";

export async function GET() {
  const { counts, error } = await fetchHazardCounts();

  if (error || !counts) {
    return NextResponse.json(
      { error: error ?? "Unable to export dashboard data." },
      { status: 500 }
    );
  }

  const csv = buildDashboardCsv({
    counts,
    exportedAt: new Date().toISOString(),
  });

  const filename = `campus-hazard-analytics-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
