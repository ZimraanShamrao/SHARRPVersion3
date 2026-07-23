"use client";

import { useCallback, useMemo, useState } from "react";
import { CollapsedWidgetBar } from "@/components/collapsed-widget-bar";
import { ExportCsvButton } from "@/components/export-csv-button";
import { WidgetCollapsePanel } from "@/components/widget-collapse-panel";
import { DashboardWidgetRenderer } from "@/components/widgets/dashboard-widget-renderer";
import type { WidgetConfig, WidgetId } from "@/components/widgets/widget-registry";
import type { HazardCounts } from "@/lib/queries/fetch-hazard-counts";
import type { AnalyticsHazardListItem } from "@/lib/queries/fetch-hazards-for-search";

const COLLAPSE_ANIMATION_MS = 300;
const SIDEBAR_PANEL_HEIGHT = "h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)]";
const SIDEBAR_HEIGHT = "h-full max-h-full";

type DashboardClientProps = {
  widgets: WidgetConfig[];
  counts: HazardCounts;
  hazards: AnalyticsHazardListItem[];
};

export function DashboardClient({
  widgets,
  counts,
  hazards,
}: DashboardClientProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<WidgetId>>(() => new Set());
  const [animatingOutIds, setAnimatingOutIds] = useState<Set<WidgetId>>(
    () => new Set()
  );
  const [restoringIds, setRestoringIds] = useState<Set<WidgetId>>(() => new Set());

  const collapsedWidgets = useMemo(
    () => widgets.filter((widget) => collapsedIds.has(widget.id)),
    [widgets, collapsedIds]
  );

  const sidebarWidgets = useMemo(
    () => widgets.filter((widget) => widget.layout === "sidebar"),
    [widgets]
  );

  const dashboardWidgets = useMemo(
    () => widgets.filter((widget) => widget.layout !== "sidebar"),
    [widgets]
  );

  const visibleSidebarWidgets = useMemo(
    () =>
      sidebarWidgets.filter(
        (widget) => !collapsedIds.has(widget.id) || animatingOutIds.has(widget.id)
      ),
    [sidebarWidgets, collapsedIds, animatingOutIds]
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

  const renderWidget = (widget: WidgetConfig, options?: { sidebar?: boolean }) => {
    if (collapsedIds.has(widget.id)) {
      return null;
    }

    const isSidebar = options?.sidebar ?? widget.layout === "sidebar";
    const isAnimatingOut = animatingOutIds.has(widget.id);
    const isRestoring = restoringIds.has(widget.id);
    const isCollapsedVisual = isAnimatingOut || isRestoring;
    const overflowClass =
      isCollapsedVisual || isSidebar ? "overflow-hidden" : "overflow-visible";

    return (
      <div
        key={widget.id}
        className={`${widget.gridClassName} ${overflowClass} transition-all duration-300 ease-in-out ${
          isSidebar ? "min-h-0 rounded-[2rem]" : ""
        } ${
          isCollapsedVisual
            ? "max-h-0 scale-[0.98] opacity-0"
            : isSidebar
              ? `${SIDEBAR_HEIGHT} scale-100 opacity-100`
              : "scale-100 opacity-100"
        }`}
      >
        <WidgetCollapsePanel
          title={widget.title}
          onCollapse={() => handleCollapse(widget.id)}
        >
          <DashboardWidgetRenderer
            widgetId={widget.id}
            counts={counts}
            hazards={hazards}
          />
        </WidgetCollapsePanel>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <CollapsedWidgetBar
          widgets={collapsedWidgets}
          onRestore={handleRestore}
        />
        <ExportCsvButton />
      </div>

      <div
        className={`grid items-start gap-4 ${
          visibleSidebarWidgets.length > 0
            ? "grid-cols-[minmax(11rem,30%)_minmax(0,1fr)]"
            : "grid-cols-1"
        }`}
      >
        {visibleSidebarWidgets.length > 0 ? (
          <aside
            className={`${SIDEBAR_PANEL_HEIGHT} sticky top-6 flex min-h-0 min-w-0 flex-col overflow-hidden`}
          >
            {sidebarWidgets.map((widget) => renderWidget(widget, { sidebar: true }))}
          </aside>
        ) : null}

        <section className="grid min-w-0 grid-cols-2 gap-4 overflow-visible pb-1">
          {dashboardWidgets.map((widget) => renderWidget(widget))}
        </section>
      </div>
    </>
  );
}
