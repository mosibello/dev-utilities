"use client";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ScoreRing, AverageCard, RunCard,
  scoreTextClass, scoreBgClass,
  buildAverage, METRICS, metricScoreClass, formatAvgNumeric,
} from "./PageSpeedReportView";

// ─── helpers ─────────────────────────────────────────────────────────────────

function extractResult(data) {
  const lhr = data.lighthouseResult;
  const audits = lhr.audits;
  const pick = (key) => ({
    display: audits[key]?.displayValue ?? "—",
    score: audits[key]?.score ?? null,
    numeric: audits[key]?.numericValue ?? null,
  });
  return {
    score: Math.round((lhr.categories.performance.score ?? 0) * 100),
    fcp: pick("first-contentful-paint"),
    lcp: pick("largest-contentful-paint"),
    tbt: pick("total-blocking-time"),
    cls: pick("cumulative-layout-shift"),
    si: pick("speed-index"),
    tti: pick("interactive"),
  };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StrategySection({ strategy, results, running, progress }) {
  const label = strategy === "mobile" ? "Mobile" : "Desktop";
  const isActive = running && progress.strategy === strategy;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold">{label}</h3>
        {isActive && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Running test {progress.runIndex + 1}/{progress.totalRuns}…
          </span>
        )}
      </div>

      {results.length > 0 && <AverageCard results={results} strategy={strategy} />}

      {results.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-2">Individual Runs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {results.map((run, i) => (
              <RunCard key={i} run={run} index={i} />
            ))}
            {isActive && (
              <div className="border rounded-lg p-4 flex flex-col gap-3 animate-pulse bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-12 rounded bg-muted" />
                    <div className="h-6 w-8 rounded bg-muted" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 rounded bg-muted" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!results.length && isActive && (
        <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground animate-pulse">
          Running first test…
        </div>
      )}
    </div>
  );
}

function SavePanel({ url, runs, mobileResults, desktopResults, onReset }) {
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [label, setLabel] = useState("");
  const [reportId, setReportId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [copied, setCopied] = useState(false);

  const reportUrl = reportId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/pagespeed-test/${reportId}`
    : null;

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError(null);
    const id = uuidv4();
    try {
      const res = await fetch("/api/pagespeed-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          label: label.trim() || null,
          url,
          runs,
          mobile: mobileResults.length ? mobileResults : null,
          desktop: desktopResults.length ? desktopResults : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setReportId(id);
      setSaveState("saved");
    } catch (err) {
      setSaveError(err.message);
      setSaveState("error");
    }
  };

  const handleCopy = async () => {
    if (!reportUrl) return;
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (saveState === "saved") {
    return (
      <div className="border rounded-lg p-4 bg-green-50 border-green-200 flex flex-col gap-3">
        <p className="text-sm font-medium text-green-800">Report saved — shareable link:</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={reportUrl}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none"
          />
          <button
            onClick={handleCopy}
            className="c__button c__button--secondary c__button__size--small shrink-0"
          >
            <div className="c__button__content">
              <span>{copied ? "Copied!" : "Copy"}</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/30 flex flex-col gap-3">
      <p className="text-sm font-medium">Save report</p>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (optional) — e.g. Homepage · Before deploy"
        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      {saveError && (
        <p className="text-xs text-red-600">{saveError}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="c__button c__button--secondary c__button__size--small disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="c__button__content">
            <span>{saveState === "saving" ? "Saving…" : "Save & get link"}</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function PageSpeedTester() {
  const [url, setUrl] = useState("");
  const [runs, setRuns] = useState(3);
  const [strategies, setStrategies] = useState({ mobile: true, desktop: true });
  const [mobileResults, setMobileResults] = useState([]);
  const [desktopResults, setDesktopResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ strategy: "", runIndex: 0, totalRuns: 0 });
  const abortRef = useRef(false);

  const selectedStrategies = Object.entries(strategies)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const handleRun = async () => {
    if (!url.trim() || !selectedStrategies.length) return;
    const target = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
    setStatus("running");
    setError(null);
    setMobileResults([]);
    setDesktopResults([]);
    abortRef.current = false;

    try {
      for (const strategy of selectedStrategies) {
        for (let i = 0; i < runs; i++) {
          if (abortRef.current) break;
          setProgress({ strategy, runIndex: i, totalRuns: runs });
          const psiUrl = new URL("https://parasbokhari--0d24ef0843f011f1ae8342b51c65c3df.web.val.run");
          psiUrl.searchParams.set("url", target);
          psiUrl.searchParams.set("strategy", strategy);

          const res = await fetch(psiUrl.toString(), { cache: "no-store" });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `PageSpeed API error (HTTP ${res.status})`);
          }
          const data = await res.json();
          const result = extractResult(data);
          if (strategy === "mobile") setMobileResults((p) => [...p, result]);
          else setDesktopResults((p) => [...p, result]);
          if (i < runs - 1 || selectedStrategies.indexOf(strategy) < selectedStrategies.length - 1) {
            await delay(1200);
          }
        }
        if (abortRef.current) break;
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  const handleStop = () => { abortRef.current = true; setStatus("done"); };

  const handleClear = () => {
    setMobileResults([]);
    setDesktopResults([]);
    setStatus("idle");
    setError(null);
  };

  const running = status === "running";
  const hasResults = mobileResults.length > 0 || desktopResults.length > 0;
  const testUrl = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;

  return (
    <div className="flex flex-col gap-6">
      {/* URL + options */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-2 flex leading-none">URL to test</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !running && handleRun()}
            placeholder="https://example.com"
            disabled={running}
            className="flex w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 flex leading-none">
              Number of runs
              <span className="ml-2 font-bold text-foreground">{runs}</span>
            </label>
            <input
              type="range" min={1} max={20} value={runs}
              onChange={(e) => setRuns(Number(e.target.value))}
              disabled={running}
              className="w-full accent-foreground disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-0.5">
              <span>1</span><span>10</span><span>20</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 flex leading-none">Strategies</label>
            <div className="flex gap-2">
              {["mobile", "desktop"].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setStrategies((prev) => {
                      const next = { ...prev, [s]: !prev[s] };
                      if (!next.mobile && !next.desktop) return prev;
                      return next;
                    })
                  }
                  disabled={running}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    strategies[s]
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                  }`}
                >
                  {s === "mobile" ? "Mobile" : "Desktop"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 items-center">
        {!running ? (
          <button
            onClick={handleRun}
            disabled={!url.trim() || !selectedStrategies.length}
            className="c__button c__button--secondary c__button__size--small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="c__button__content">
              <span>Run Test{runs > 1 ? `s (${runs})` : ""}</span>
            </div>
          </button>
        ) : (
          <button onClick={handleStop} className="c__button c__button--secondary c__button__size--small">
            <div className="c__button__content"><span>Stop</span></div>
          </button>
        )}
        {hasResults && !running && (
          <button onClick={handleClear} className="c__button c__button--secondary c__button__size--small">
            <div className="c__button__content"><span>Clear</span></div>
          </button>
        )}
        {running && (
          <span className="text-sm text-muted-foreground">
            {progress.strategy === "mobile" ? "Mobile" : "Desktop"} · Test {progress.runIndex + 1}/{runs}
            {selectedStrategies.length > 1 && ` · ${progress.strategy}`}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {running && (
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500"
            style={{
              width: `${
                ((selectedStrategies.indexOf(progress.strategy) * runs + progress.runIndex) /
                  (selectedStrategies.length * runs)) * 100
              }%`,
            }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <span className="font-medium">Error: </span>{error}
        </div>
      )}

      {/* Save panel */}
      {status === "done" && hasResults && (
        <SavePanel
          url={testUrl}
          runs={runs}
          mobileResults={mobileResults}
          desktopResults={desktopResults}
        />
      )}

      {/* Results */}
      {(hasResults || running) && (
        <div className="flex flex-col gap-8">
          {(strategies.mobile && (mobileResults.length > 0 || (running && progress.strategy === "mobile"))) && (
            <StrategySection strategy="mobile" results={mobileResults} running={running} progress={progress} />
          )}
          {(strategies.desktop && (desktopResults.length > 0 || (running && progress.strategy === "desktop"))) && (
            <StrategySection strategy="desktop" results={desktopResults} running={running} progress={progress} />
          )}
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
