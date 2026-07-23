import { StatWidget } from "@/components/widgets/stat-widget";

type TotalHazardsWidgetProps = {
  total: number;
};

export function TotalHazardsWidget({ total }: TotalHazardsWidgetProps) {
  return (
    <StatWidget
      title="Total Hazard Reports"
      subtitle="(Unresolved, In Progress & Resolved)"
      value={total}
      description="All hazard reports in the system"
    />
  );
}
