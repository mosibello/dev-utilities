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

async function runTests({ target, runs, strategies, apiKey }) {
  for (const strategy of strategies) {
    for (let i = 0; i < runs; i++) {
      self.postMessage({ type: "progress", strategy, runIndex: i, totalRuns: runs });

      try {
        const psiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
        psiUrl.searchParams.set("url", target);
        psiUrl.searchParams.set("strategy", strategy);
        psiUrl.searchParams.set("category", "performance");
        if (apiKey) psiUrl.searchParams.set("key", apiKey);

        const res = await fetch(psiUrl.toString(), { cache: "no-store" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `PageSpeed API error (HTTP ${res.status})`);
        }
        const data = await res.json();
        const result = extractResult(data);
        self.postMessage({ type: "result", strategy, result });

        const isLast =
          i === runs - 1 &&
          strategies.indexOf(strategy) === strategies.length - 1;

        if (!isLast) {
          const WAIT = 30;
          for (let s = WAIT; s > 0; s--) {
            self.postMessage({ type: "cooldown", seconds: s });
            await delay(1000);
          }
          self.postMessage({ type: "cooldown", seconds: 0 });
        }
      } catch (err) {
        self.postMessage({ type: "error", message: err.message || "Something went wrong" });
        return;
      }
    }
  }

  self.postMessage({ type: "done" });
}

self.onmessage = (e) => {
  if (e.data.type === "start") {
    runTests(e.data);
  }
};
