import Link from "next/link";

const primaryButtonClassName =
  "flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl bg-slate-800 px-4 text-base font-semibold text-white shadow-md shadow-slate-800/20 transition-colors hover:bg-slate-900 active:bg-black sm:px-6";

const secondaryButtonClassName =
  "flex min-h-14 w-full shrink-0 items-center justify-center rounded-xl border-2 border-slate-800 bg-white px-4 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:bg-slate-100 sm:px-6";

type UnresolvedHazardDetailActionsProps = {
  hazardId: string;
};

export function UnresolvedHazardDetailActions({
  hazardId,
}: UnresolvedHazardDetailActionsProps) {
  const inProgressHref = `/hazards/unresolved/${encodeURIComponent(hazardId)}/in-progress`;
  const resolveHref = `/hazards/unresolved/${encodeURIComponent(hazardId)}/resolve`;

  return (
    <div className="flex flex-col gap-3">
      <Link href={inProgressHref} className={secondaryButtonClassName}>
        Mark Hazard As In Progress
      </Link>
      <Link href={resolveHref} className={primaryButtonClassName}>
        Mark Hazard As Resolved
      </Link>
      <Link
        href="/hazards/unresolved"
        className={secondaryButtonClassName}
      >
        Back to List
      </Link>
    </div>
  );
}
