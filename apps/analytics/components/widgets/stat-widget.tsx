type StatWidgetProps = {
  title: string;
  subtitle?: string;
  value: number;
  description: string;
};

export function StatWidget({
  title,
  subtitle,
  value,
  description,
}: StatWidgetProps) {
  return (
    <section className="flex h-full min-h-[220px] w-full flex-col overflow-hidden rounded-[2rem] border border-[#a7d7b5] bg-[#edf7ef] shadow-sm">
      <header className="border-b border-[#a7d7b5] bg-[#d4edd9] px-4 py-3 text-center">
        <h2 className="text-sm font-semibold text-[#323232] min-[1200px]:text-base">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[#4b5563] min-[1200px]:text-sm">{subtitle}</p>
        ) : null}
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-3 text-center min-[1200px]:p-4">
        <p className="text-3xl font-bold tabular-nums text-[#991b1b] min-[1200px]:text-4xl min-[1400px]:text-5xl">
          {value.toLocaleString()}
        </p>
        <p className="mt-2 text-xs font-medium text-[#991b1b] min-[1200px]:text-sm">{description}</p>
      </div>
    </section>
  );
}
