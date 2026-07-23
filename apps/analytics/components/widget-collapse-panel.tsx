"use client";

import type { ReactNode } from "react";

type WidgetCollapsePanelProps = {
  title: string;
  onCollapse: () => void;
  children: ReactNode;
};

export function WidgetCollapsePanel({
  title,
  onCollapse,
  children,
}: WidgetCollapsePanelProps) {
  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        onClick={onCollapse}
        aria-label={`Collapse ${title}`}
        title={`Collapse ${title}`}
        className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#7fb892] bg-[#edf7ef] text-base font-semibold leading-none text-[#2f6b3f] shadow-sm transition-colors hover:bg-[#d4edd9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb892] focus-visible:ring-offset-2"
      >
        −
      </button>
      {children}
    </div>
  );
}
