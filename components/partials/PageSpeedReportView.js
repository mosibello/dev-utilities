"use client";

// ─── helpers (shared with PageSpeedTester) ───────────────────────────────────

export const METRICS = [
  { key: "fcp", label: "FCP", title: "First Contentful Paint" },
  { key: "lcp", label: "LCP", title: "Largest Contentful Paint" },
  { key: "tbt", label: "TBT", title: "Total Blocking Time" },
  { key: "cls", label: "CLS", title: "Cumulative Layout Shift" },
  { key: "si",  label: "SI",  title: "Speed Index" },
  { key: "tti", label: "TTI", title: "Time to Interactive" },
];

export function scoreColor(s) {
  if (s === null) return "#9ca3af";
  if (s >= 0.9) return "#16a34a";
  if (s >= 0.5) return "#f97316";
  return "#dc2626";
}

export function scoreTextClass(s) {
  if (s === null) return "text-muted-foreground";
  if (s >= 90) return "text-green-600";
  if (s >= 50) return "text-orange-500";
  return "text-red-600";
}

export function scoreBgClass(s) {
  if (s === null) return "";
  if (s >= 90) return "bg-green-50 border-green-200";
  if (s >= 50) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function metricScoreClass(s) {
  if (s === null) return "text-muted-foreground";
  if (s >= 0.9) return "text-green-600";
  if (s >= 0.5) return "text-orange-500";
  return "text-red-600";
}

export function formatAvgNumeric(key, numeric) {
  if (numeric === null) return "—";
  if (key === "cls") return numeric.toFixed(3);
  if (key === "tbt") return `${Math.round(numeric)} ms`;
  return `${(numeric / 1000).toFixed(1)} s`;
}

export function buildAverage(results) {
  if (!results?.length) return null;
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const score = Math.round(avg(results.map((r) => r.score)));
  const avgMetric = (key) => {
    const scores = results.map((r) => r[key].score).filter((v) => v !== null);
    const numerics = results.map((r) => r[key].numeric).filter((v) => v !== null);
    return {
      score: scores.length ? avg(scores) : null,
      numeric: numerics.length ? avg(numerics) : null,
    };
  };
  return { score, fcp: avgMetric("fcp"), lcp: avgMetric("lcp"), tbt: avgMetric("tbt"), cls: avgMetric("cls"), si: avgMetric("si"), tti: avgMetric("tti") };
}

// ─── display components ──────────────────────────────────────────────────────

export function ScoreRing({ score, size = 96 }) {
  const r = size * 0.38;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  const fill = score !== null ? (circumference * score) / 100 : 0;
  const color = scoreColor(score !== null ? score / 100 : null);
  const sw = size * 0.085;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={`${fill} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
      <text x={cx} y={cx} textAnchor="middle" dy="0.35em"
        fontSize={size * 0.22} fontWeight="700" fill={color} fontFamily="inherit">
        {score ?? "—"}
      </text>
    </svg>
  );
}

export function MetricsRow({ result, isAvg = false }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-3">
      {METRICS.map(({ key, label, title }) => {
        const m = result[key];
        const sc = m.score;
        const display = isAvg ? formatAvgNumeric(key, m.numeric) : m.display;
        return (
          <div key={key} className="flex flex-col gap-0.5" title={title}>
            <span className={`text-sm font-semibold font-mono ${metricScoreClass(sc)}`}>
              {display}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">{label} — {title}</span>
          </div>
        );
      })}
    </div>
  );
}

export function RunCard({ run, index }) {
  return (
    <div className={`border rounded-lg p-4 flex flex-col gap-3 ${scoreBgClass(run.score)}`}>
      <div className="flex items-center gap-4">
        <ScoreRing score={run.score} size={64} />
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Run {index + 1}</p>
          <p className={`text-2xl font-bold ${scoreTextClass(run.score)}`}>{run.score}</p>
          <p className="text-[11px] text-muted-foreground">Performance</p>
        </div>
      </div>
      <MetricsRow result={run} />
    </div>
  );
}

export function AverageCard({ results, strategy }) {
  const avg = buildAverage(results);
  if (!avg) return null;
  return (
    <div className={`border-2 rounded-xl p-5 flex flex-col gap-4 ${scoreBgClass(avg.score)}`}>
      <div className="flex items-center gap-5">
        <ScoreRing score={avg.score} size={96} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {strategy === "mobile" ? "Mobile" : "Desktop"} — Average of {results.length} run{results.length !== 1 ? "s" : ""}
          </p>
          <p className={`text-5xl font-bold leading-none ${scoreTextClass(avg.score)}`}>{avg.score}</p>
          <p className="text-sm text-muted-foreground mt-1">Performance Score</p>
        </div>
      </div>
      <div className="border-t pt-3">
        <p className="text-xs text-muted-foreground font-medium mb-2">Average Core Web Vitals</p>
        <MetricsRow result={avg} isAvg />
      </div>
    </div>
  );
}

// Full read-only report view — used on the shareable report page
export default function PageSpeedReportView({ report }) {
  const { label, url, runs, mobile, desktop, created_at } = report;
  const date = created_at ? new Date(created_at).toLocaleString() : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b pb-4">
        {label && <h2 className="text-xl font-semibold">{label}</h2>}
        <p className="text-sm text-muted-foreground break-all">{url}</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-1">
          <span>{runs} run{runs !== 1 ? "s" : ""}</span>
          {date && <span>{date}</span>}
          {mobile?.length > 0 && <span>Mobile</span>}
          {desktop?.length > 0 && <span>Desktop</span>}
        </div>
      </div>

      {/* Mobile results */}
      {mobile?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold">Mobile</h3>
          <AverageCard results={mobile} strategy="mobile" />
          <p className="text-xs text-muted-foreground font-medium">Individual Runs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {mobile.map((run, i) => <RunCard key={i} run={run} index={i} />)}
          </div>
        </div>
      )}

      {/* Desktop results */}
      {desktop?.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-semibold">Desktop</h3>
          <AverageCard results={desktop} strategy="desktop" />
          <p className="text-xs text-muted-foreground font-medium">Individual Runs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {desktop.map((run, i) => <RunCard key={i} run={run} index={i} />)}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t pt-4">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> 90–100 Good</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> 50–89 Needs improvement</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> 0–49 Poor</span>
      </div>
    </div>
  );
}
