import { TotalHazardsWidget } from "@/components/widgets/total-hazards";
import { TotalInProgressWidget } from "@/components/widgets/total-in-progress";
import { TotalUnresolvedWidget } from "@/components/widgets/total-unresolved";
import type { WidgetId } from "@/components/widgets/widget-registry";
import type { HazardCounts } from "@/lib/queries/fetch-hazard-counts";

type DashboardWidgetRendererProps = {
  widgetId: WidgetId;
  counts: HazardCounts;
};

export function DashboardWidgetRenderer({
  widgetId,
  counts,
}: DashboardWidgetRendererProps) {
  switch (widgetId) {
    case "total-hazards":
      return <TotalHazardsWidget total={counts.total} />;
    case "total-unresolved":
      return <TotalUnresolvedWidget total={counts.unresolved} />;
    case "total-in-progress":
      return <TotalInProgressWidget total={counts.inProgress} />;
    default:
      return null;
  }
}
