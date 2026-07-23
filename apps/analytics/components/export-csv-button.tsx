export function ExportCsvButton() {
  return (
    <a
      href="/api/export"
      download
      className="inline-flex items-center justify-center rounded-full border border-[#7fb892] bg-[#edf7ef] px-4 py-2 text-sm font-semibold text-[#2f6b3f] shadow-sm transition-colors hover:bg-[#d4edd9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7fb892] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a365d]"
    >
      Export CSV
    </a>
  );
}
