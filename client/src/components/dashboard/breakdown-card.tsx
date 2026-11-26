interface BreakdownCardProps {
  title: string;
  data: Record<string, number>;
  labels: Record<string, string>;
}

export function BreakdownCard({ title, data, labels }: BreakdownCardProps) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No data yet</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map(([key, count]) => {
            const percent = total > 0 ? (count / total) * 100 : 0;

            return (
              <li key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{labels[key] ?? key}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <svg
                    viewBox="0 0 100 1"
                    preserveAspectRatio="none"
                    className="size-full"
                    aria-hidden="true"
                  >
                    <rect width={percent} height="1" className="fill-primary" />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
