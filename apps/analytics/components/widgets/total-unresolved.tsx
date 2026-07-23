import { StatWidget } from "@/components/widgets/stat-widget";

type TotalUnresolvedWidgetProps = {
  total: number;
};

export function TotalUnresolvedWidget({ total }: TotalUnresolvedWidgetProps) {
  return (
    <StatWidget
      title="Total Unresolved Hazards"
      subtitle="(Awaiting action)"
      value={total}
      description="Hazards not yet in progress or resolved"
    />
  );
}
