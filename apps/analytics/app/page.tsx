import { DashboardClient } from "@/components/dashboard-client";
import { DashboardShell } from "@/components/dashboard-shell";
import { getEnabledWidgets } from "@/components/widgets/widget-registry";
import { fetchHazardCounts } from "@/lib/queries/fetch-hazard-counts";

export default async function AnalyticsDashboardPage() {
  const enabledWidgets = getEnabledWidgets();
  const { counts, error } = await fetchHazardCounts();

  return (
    <DashboardShell>
      {error || !counts ? (
        <p
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error ?? "Unable to load hazard counts. Please try again."}
        </p>
      ) : (
        <DashboardClient widgets={enabledWidgets} counts={counts} />
      )}
    </DashboardShell>
  );
}
