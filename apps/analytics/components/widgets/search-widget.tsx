"use client";

import {
  HAZARD_STATUS,
  type HazardStatus,
} from "@campus-hazard/shared";
import { useMemo, useState } from "react";
import { HazardSearchCard } from "@/components/hazard-search-card";
import type { AnalyticsHazardListItem } from "@/lib/queries/fetch-hazards-for-search";
import { filterAnalyticsHazards } from "@/lib/utils/filter-analytics-hazards";

const STATUS_OPTIONS: HazardStatus[] = [
  HAZARD_STATUS.UNRESOLVED,
  HAZARD_STATUS.IN_PROGRESS,
  HAZARD_STATUS.RESOLVED,
];

const DEFAULT_SELECTED_STATUSES: HazardStatus[] = [...STATUS_OPTIONS];

type SearchWidgetProps = {
  hazards: AnalyticsHazardListItem[];
};

export function SearchWidget({ hazards }: SearchWidgetProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<HazardStatus[]>(
    DEFAULT_SELECTED_STATUSES
  );
  const [query, setQuery] = useState("");

  const filteredHazards = useMemo(
    () => filterAnalyticsHazards(hazards, selectedStatuses, query),
    [hazards, selectedStatuses, query]
  );

  const toggleStatus = (status: HazardStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status]
    );
  };

  const emptyMessage = (() => {
    if (selectedStatuses.length === 0) {
      return "Select at least one hazard status to view results.";
    }

    if (query.trim()) {
      return "No hazards match your search.";
    }

    return "No hazards found for the selected statuses.";
  })();

  return (
    <section className="flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-[#a7d7b5] bg-[#edf7ef] shadow-sm">
      <header className="shrink-0 border-b border-[#a7d7b5] bg-[#d4edd9] px-4 py-2.5 text-center">
        <h2 className="text-sm font-semibold text-[#323232]">Search</h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        <fieldset className="shrink-0 space-y-1.5">
          <legend className="text-xs font-semibold text-[#323232]">
            Hazard Status
          </legend>
          <div className="flex flex-col gap-1">
            {STATUS_OPTIONS.map((status) => {
              const isSelected = selectedStatuses.includes(status);
              const inputId = `hazard-status-${status.replace(/\s+/g, "-").toLowerCase()}`;

              return (
                <label
                  key={status}
                  htmlFor={inputId}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-colors ${
                    isSelected
                      ? "border-[#7fb892] bg-[#d4edd9] text-[#2f6b3f]"
                      : "border-[#a7d7b5] bg-white text-[#4b5563] hover:bg-[#f5fbf6]"
                  }`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleStatus(status)}
                    className="h-3.5 w-3.5 rounded border-[#7fb892] text-[#2f6b3f] focus:ring-[#7fb892]"
                  />
                  <span className="font-medium">{status}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-2 shrink-0 space-y-1">
          <label
            htmlFor="analytics-hazard-search"
            className="text-xs font-semibold text-[#323232]"
          >
            Search
          </label>
          <input
            id="analytics-hazard-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by ID, description, location, or date…"
            autoComplete="off"
            className="h-9 w-full rounded-lg border border-[#a7d7b5] bg-white px-2.5 text-sm text-[#323232] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#7fb892] focus:ring-2 focus:ring-[#7fb892]/30"
          />
        </div>

        <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <p className="mb-1 shrink-0 text-[11px] font-medium text-[#4b5563]">
            {filteredHazards.length} result
            {filteredHazards.length === 1 ? "" : "s"}
          </p>
          <div className="min-h-[6.5rem] flex-1 overflow-y-auto overscroll-contain pr-0.5">
            {filteredHazards.length === 0 ? (
              <p className="rounded-lg border border-[#a7d7b5] bg-white px-2.5 py-4 text-center text-xs text-[#4b5563]">
                {emptyMessage}
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {filteredHazards.map((hazard) => (
                  <li key={hazard.hazardId}>
                    <HazardSearchCard hazard={hazard} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
