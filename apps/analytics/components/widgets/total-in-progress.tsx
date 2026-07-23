import { StatWidget } from "@/components/widgets/stat-widget";

type TotalInProgressWidgetProps = {
  total: number;
};

export function TotalInProgressWidget({ total }: TotalInProgressWidgetProps) {
  return (
    <StatWidget
      title="Total Hazards In Progress"
      subtitle="(Under active maintenance)"
      value={total}
      description="Hazards currently being addressed"
    />
  );
}
