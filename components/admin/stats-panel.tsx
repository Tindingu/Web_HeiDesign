type StatSummary = {
  label: string;
  value: number;
  tone?: "slate" | "amber" | "emerald" | "sky";
};

type ChartDatum = {
  label: string;
  value: number;
};

type StatsPanelProps = {
  title: string;
  subtitle?: string;
  summaries: StatSummary[];
  chartTitle: string;
  data: ChartDatum[];
  emptyText?: string;
};

const toneClassMap: Record<NonNullable<StatSummary["tone"]>, string> = {
  slate: "from-slate-900 to-slate-700",
  amber: "from-amber-600 to-orange-500",
  emerald: "from-emerald-600 to-teal-500",
  sky: "from-sky-600 to-indigo-500",
};

export function StatsPanel({
  title,
  subtitle,
  summaries,
  chartTitle,
  data,
  emptyText = "Chưa có dữ liệu để hiển thị biểu đồ",
}: StatsPanelProps) {
  const safeData = data.filter((item) => item.value > 0);
  const maxValue = safeData.reduce((max, item) => Math.max(max, item.value), 0) || 1;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaries.map((summary) => (
          <div
            key={summary.label}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {summary.label}
            </p>
            <div
              className={`mt-2 inline-flex rounded-md bg-gradient-to-r px-3 py-1.5 text-xl font-bold text-white ${
                toneClassMap[summary.tone || "slate"]
              }`}
            >
              {summary.value}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-700">{chartTitle}</h3>
        {safeData.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">{emptyText}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {safeData.map((item) => {
              const width = Math.max(8, Math.round((item.value / maxValue) * 100));
              return (
                <div key={item.label} className="grid grid-cols-[minmax(120px,220px)_1fr_auto] items-center gap-3">
                  <span className="truncate text-sm text-slate-600">{item.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{item.value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
