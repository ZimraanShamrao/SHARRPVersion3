export type WidgetId =
  | "total-hazards"
  | "total-unresolved"
  | "total-in-progress"
  | "avg-resolution-time"
  | "common-locations"
  | "monthly-reports";

export type WidgetConfig = {
  id: WidgetId;
  title: string;
  enabled: boolean;
  gridClassName: string;
};

export const WIDGET_REGISTRY: WidgetConfig[] = [
  {
    id: "total-hazards",
    title: "Total Hazard Reports",
    enabled: true,
    gridClassName: "col-span-1 md:col-span-2 xl:col-span-2",
  },
  {
    id: "total-unresolved",
    title: "Total Unresolved Hazards",
    enabled: true,
    gridClassName: "col-span-1 xl:col-span-1",
  },
  {
    id: "total-in-progress",
    title: "Total Hazards In Progress",
    enabled: true,
    gridClassName: "col-span-1 xl:col-span-1",
  },
  {
    id: "avg-resolution-time",
    title: "Average Resolution Time",
    enabled: false,
    gridClassName: "col-span-1 md:col-span-2 xl:col-span-2",
  },
  {
    id: "common-locations",
    title: "Most Common Locations",
    enabled: false,
    gridClassName: "col-span-1 md:col-span-2 xl:col-span-2",
  },
  {
    id: "monthly-reports",
    title: "Monthly Reports",
    enabled: false,
    gridClassName: "col-span-1 md:col-span-2 xl:col-span-4",
  },
];

export function getEnabledWidgets(): WidgetConfig[] {
  return WIDGET_REGISTRY.filter((widget) => widget.enabled);
}

export function getWidgetConfig(widgetId: WidgetId): WidgetConfig | undefined {
  return WIDGET_REGISTRY.find((widget) => widget.id === widgetId);
}
