"use client";

import { filterHazardList, type HazardListItem } from "@campus-hazard/shared";
import { useMemo, useState } from "react";
import { HazardCard } from "@/components/hazard-card";

const searchInputClassName =
  "h-14 min-w-0 w-full max-w-full rounded-xl border border-zinc-300 bg-white px-4 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

type HazardListProps = {
  hazards: HazardListItem[];
  searchInputId: string;
  searchLabel: string;
  emptyMessage: string;
  detailHrefPrefix: string;
};

export function HazardList({
  hazards,
  searchInputId,
  searchLabel,
  emptyMessage,
  detailHrefPrefix,
}: HazardListProps) {
  const [query, setQuery] = useState("");

  const filteredHazards = useMemo(
    () => filterHazardList(hazards, query),
    [hazards, query]
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="sr-only" htmlFor={searchInputId}>
        {searchLabel}
      </label>
      <input
        id={searchInputId}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by ID, description, location, or date…"
        className={searchInputClassName}
        autoComplete="off"
      />

      {filteredHazards.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-base text-zinc-600">
          {query.trim() ? "No hazards match your search." : emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredHazards.map((hazard) => (
            <li key={hazard.hazardId}>
              <HazardCard
                hazard={hazard}
                detailHref={`${detailHrefPrefix}${encodeURIComponent(hazard.hazardId)}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
