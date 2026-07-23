import { DashboardClient } from "@/components/dashboard-client";
import { DashboardShell } from "@/components/dashboard-shell";
import { getEnabledWidgets } from "@/components/widgets/widget-registry";
import { fetchHazardCounts } from "@/lib/queries/fetch-hazard-counts";
import { fetchHazardsForSearch } from "@/lib/queries/fetch-hazards-for-search";

export default async function AnalyticsDashboardPage() {
  const enabledWidgets = getEnabledWidgets();

  const [countsResult, hazardsResult] = await Promise.all([
    fetchHazardCounts(),
    fetchHazardsForSearch(),
  ]);

  const error =
    countsResult.error ??
    hazardsResult.error ??
    (!countsResult.counts ? "Unable to load hazard counts. Please try again." : null);

  return (
    <DashboardShell>
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : (
        <DashboardClient
          widgets={enabledWidgets}
          counts={countsResult.counts!}
          hazards={hazardsResult.hazards}
        />
      )}
    </DashboardShell>
  );
}
