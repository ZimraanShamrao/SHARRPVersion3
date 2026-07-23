"use client";

import { useCallback, useMemo, useState } from "react";
import { CollapsedWidgetBar } from "@/components/collapsed-widget-bar";
import { ExportCsvButton } from "@/components/export-csv-button";
import { WidgetCollapsePanel } from "@/components/widget-collapse-panel";
import { DashboardWidgetRenderer } from "@/components/widgets/dashboard-widget-renderer";
import type { WidgetConfig, WidgetId } from "@/components/widgets/widget-registry";
import type { HazardCounts } from "@/lib/queries/fetch-hazard-counts";

const COLLAPSE_ANIMATION_MS = 300;

type DashboardClientProps = {
  widgets: WidgetConfig[];
  counts: HazardCounts;
};

export function DashboardClient({ widgets, counts }: DashboardClientProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<WidgetId>>(() => new Set());
  const [animatingOutIds, setAnimatingOutIds] = useState<Set<WidgetId>>(
    () => new Set()
  );
  const [restoringIds, setRestoringIds] = useState<Set<WidgetId>>(() => new Set());

  const collapsedWidgets = useMemo(
    () => widgets.filter((widget) => collapsedIds.has(widget.id)),
    [widgets, collapsedIds]
  );

  const handleCollapse = useCallback((widgetId: WidgetId) => {
    setAnimatingOutIds((current) => new Set(current).add(widgetId));

    window.setTimeout(() => {
      setCollapsedIds((current) => new Set(current).add(widgetId));
      setAnimatingOutIds((current) => {
        const next = new Set(current);
        next.delete(widgetId);
        return next;
      });
    }, COLLAPSE_ANIMATION_MS);
  }, []);

  const handleRestore = useCallback((widgetId: WidgetId) => {
    setCollapsedIds((current) => {
      const next = new Set(current);
      next.delete(widgetId);
      return next;
    });
    setRestoringIds((current) => new Set(current).add(widgetId));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRestoringIds((current) => {
          const next = new Set(current);
          next.delete(widgetId);
          return next;
        });
      });
    });
  }, []);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <CollapsedWidgetBar
          widgets={collapsedWidgets}
          onRestore={handleRestore}
        />
        <ExportCsvButton />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {widgets.map((widget) => {
          if (collapsedIds.has(widget.id)) {
            return null;
          }

          const isAnimatingOut = animatingOutIds.has(widget.id);
          const isRestoring = restoringIds.has(widget.id);
          const isCollapsedVisual = isAnimatingOut || isRestoring;

          return (
            <div
              key={widget.id}
              className={`${widget.gridClassName} overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsedVisual
                  ? "max-h-0 scale-[0.98] opacity-0"
                  : "max-h-[800px] scale-100 opacity-100"
              }`}
            >
              <WidgetCollapsePanel
                title={widget.title}
                onCollapse={() => handleCollapse(widget.id)}
              >
                <DashboardWidgetRenderer widgetId={widget.id} counts={counts} />
              </WidgetCollapsePanel>
            </div>
          );
        })}
      </div>
    </>
  );
}
