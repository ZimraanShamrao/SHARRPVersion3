"use client";

import type { WidgetConfig } from "@/components/widgets/widget-registry";

type CollapsedWidgetBarProps = {
  widgets: WidgetConfig[];
  onRestore: (widgetId: WidgetConfig["id"]) => void;
};

export function CollapsedWidgetBar({
  widgets,
  onRestore,
}: CollapsedWidgetBarProps) {
  if (widgets.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {widgets.map((widget) => (
        <button
          key={widget.id}
          type="button"
          onClick={() => onRestore(widget.id)}
          className="rounded-full border border-[#7fb892] bg-[#d4edd9] px-4 py-1.5 text-sm font-medium text-[#2f6b3f] shadow-sm transition-all duration-300 hover:bg-[#c2e4c9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb892] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a365d]"
        >
          {widget.title}
        </button>
      ))}
    </div>
  );
}
