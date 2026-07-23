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
    <section className="flex h-full min-h-[240px] w-full flex-col overflow-hidden rounded-[2rem] border border-[#a7d7b5] bg-[#edf7ef] shadow-sm">
      <header className="border-b border-[#a7d7b5] bg-[#d4edd9] px-5 py-4 text-center">
        <h2 className="text-base font-semibold text-[#323232] sm:text-lg">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#4b5563]">{subtitle}</p>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
        <p className="text-5xl font-bold tabular-nums text-[#991b1b] sm:text-6xl">
          {value.toLocaleString()}
        </p>
        <p className="mt-3 text-sm font-medium text-[#991b1b]">{description}</p>
      </div>
    </section>
  );
}
