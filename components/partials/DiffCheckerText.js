"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { diffLines, diffChars, diffWords } from "diff";

const MODES = [
  { value: "lines", label: "Lines" },
  { value: "words", label: "Words" },
  { value: "chars", label: "Characters" },
];

const CONTAINER_HEIGHT = 540;

function getDiff(original, modified, mode) {
  if (mode === "chars") return diffChars(original, modified);
  if (mode === "words") return diffWords(original, modified);
  return diffLines(original, modified);
}

// Build aligned row array from diff parts, plus change groups for navigation
function buildSplitRows(parts) {
  let leftLines = [];
  let rightLines = [];

  parts.forEach((part) => {
    const lines = part.value.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();

    if (part.added) {
      lines.forEach((text) => rightLines.push({ text, type: "added" }));
    } else if (part.removed) {
      lines.forEach((text) => leftLines.push({ text, type: "removed" }));
    } else {
      const maxLen = Math.max(leftLines.length, rightLines.length);
      while (leftLines.length < maxLen) leftLines.push({ text: "", type: "empty" });
      while (rightLines.length < maxLen) rightLines.push({ text: "", type: "empty" });
      lines.forEach((text) => {
        leftLines.push({ text, type: "unchanged" });
        rightLines.push({ text, type: "unchanged" });
      });
    }
  });

  const maxLen = Math.max(leftLines.length, rightLines.length);
  while (leftLines.length < maxLen) leftLines.push({ text: "", type: "empty" });
  while (rightLines.length < maxLen) rightLines.push({ text: "", type: "empty" });

  let lNum = 0;
  let rNum = 0;
  const rows = leftLines.map((left, i) => {
    const right = rightLines[i];
    return {
      left,
      right,
      lNum: left.type !== "empty" ? ++lNum : null,
      rNum: right.type !== "empty" ? ++rNum : null,
    };
  });

  // Identify change groups (blocks of consecutive changed rows)
  const changeGroups = [];
  let inGroup = false;
  let groupStart = -1;
  rows.forEach(({ left, right }, i) => {
    const changed = left.type !== "unchanged" || right.type !== "unchanged";
    if (changed && !inGroup) {
      inGroup = true;
      groupStart = i;
    } else if (!changed && inGroup) {
      inGroup = false;
      changeGroups.push({ start: groupStart, end: i - 1 });
    }
  });
  if (inGroup) changeGroups.push({ start: groupStart, end: rows.length - 1 });

  return { rows, changeGroups, totalLeft: lNum, totalRight: rNum };
}

function rowBg(type) {
  if (type === "removed") return "bg-red-50 border-l-2 border-l-red-400";
  if (type === "added") return "bg-green-50 border-l-2 border-l-green-400";
  if (type === "empty") return "bg-muted/20";
  return "";
}

// Overview ruler / minimap — thin sidebar showing change positions
function Minimap({ rows, scrollRef }) {
  const minimapRef = useRef(null);
  const [viewport, setViewport] = useState({ top: 0, height: CONTAINER_HEIGHT });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const sh = el.scrollHeight;
      const ch = el.clientHeight;
      if (sh <= ch) {
        setViewport({ top: 0, height: CONTAINER_HEIGHT });
        return;
      }
      const scrollRatio = el.scrollTop / (sh - ch);
      const visibleRatio = ch / sh;
      setViewport({
        top: scrollRatio * (1 - visibleRatio) * CONTAINER_HEIGHT,
        height: Math.max(visibleRatio * CONTAINER_HEIGHT, 20),
      });
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollRef]);

  const handleClick = (e) => {
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (e.clientY - rect.top) / rect.height;
    const el = scrollRef.current;
    if (el) el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  };

  const lineH = CONTAINER_HEIGHT / Math.max(rows.length, 1);

  return (
    <div
      ref={minimapRef}
      onClick={handleClick}
      className="relative shrink-0 cursor-pointer select-none border-l"
      style={{ width: 20, height: CONTAINER_HEIGHT, backgroundColor: "hsl(var(--muted))" }}
    >
      {rows.map(({ left, right }, i) => {
        const isRemoved = left.type === "removed";
        const isAdded = right.type === "added";
        if (!isRemoved && !isAdded) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * lineH,
              left: 0,
              right: 0,
              height: Math.max(lineH, 1.5),
              backgroundColor: isRemoved ? "#fca5a5" : "#86efac",
            }}
          />
        );
      })}
      {/* Viewport indicator */}
      <div
        style={{
          position: "absolute",
          top: viewport.top,
          left: 0,
          right: 0,
          height: viewport.height,
          backgroundColor: "rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.12)",
          pointerEvents: "none",
          zIndex: 10,
          transition: "top 80ms linear, height 80ms linear",
        }}
      />
    </div>
  );
}

function SplitDiffView({ parts, original, modified }) {
  const scrollRef = useRef(null);
  const rowRefs = useRef({});
  const [currentChangeIdx, setCurrentChangeIdx] = useState(-1);

  const { rows, changeGroups, totalLeft, totalRight } = useMemo(
    () => buildSplitRows(parts),
    [parts]
  );

  const removedCount = rows.filter((r) => r.left.type === "removed").length;
  const addedCount = rows.filter((r) => r.right.type === "added").length;
  const hasChanges = removedCount > 0 || addedCount > 0;

  // Widen the line-number gutter for files with 5- or 6-digit line counts
  const maxLines = Math.max(totalLeft, totalRight);
  const gutterWidth = maxLines >= 100000 ? "w-16" : maxLines >= 10000 ? "w-14" : "w-10";

  const handleCopy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const scrollToGroup = (idx) => {
    const group = changeGroups[idx];
    if (!group) return;
    const container = scrollRef.current;
    const targetEl = rowRefs.current[group.start];
    if (!container || !targetEl) return;
    // Scroll only the diff container — not the window — so the stats bar stays visible
    const containerTop = container.getBoundingClientRect().top;
    const targetTop = targetEl.getBoundingClientRect().top;
    const relativeOffset = targetTop - containerTop + container.scrollTop;
    container.scrollTo({
      top: relativeOffset - container.clientHeight / 2 + targetEl.offsetHeight / 2,
      behavior: "smooth",
    });
    setCurrentChangeIdx(idx);
  };

  const navigatePrev = () => {
    if (currentChangeIdx <= 0) return;
    scrollToGroup(currentChangeIdx - 1);
  };

  const navigateNext = () => {
    const next = currentChangeIdx === -1 ? 0 : currentChangeIdx + 1;
    if (next >= changeGroups.length) return;
    scrollToGroup(next);
  };

  const atFirst = currentChangeIdx === 0;
  const atLast = currentChangeIdx === changeGroups.length - 1;
  const changeLabel = currentChangeIdx === -1
    ? `${changeGroups.length} change${changeGroups.length !== 1 ? "s" : ""}`
    : `${currentChangeIdx + 1}/${changeGroups.length} change${changeGroups.length !== 1 ? "s" : ""}`;

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      {/* Stats bar */}
      {!hasChanges ? (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border-b px-4 py-2.5">
          <span className="font-medium">No differences found.</span>
          <span className="text-muted-foreground">Both texts are identical.</span>
        </div>
      ) : (
        <div className="flex text-sm border-b">
          {/* Left — removals */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-red-50/70 border-r">
            <span className="font-semibold text-red-700">{removedCount} removals</span>
            <span className="text-muted-foreground text-xs">| {totalLeft} lines</span>
            <button
              onClick={() => handleCopy(original)}
              className="ml-auto text-xs border rounded px-2 py-0.5 bg-background hover:bg-muted transition-colors"
            >
              Copy
            </button>
          </div>
          {/* Right — additions */}
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-green-50/70">
            <span className="font-semibold text-green-700">{addedCount} additions</span>
            <span className="text-muted-foreground text-xs">| {totalRight} lines</span>
            <div className="ml-auto flex items-center gap-1.5">
              {changeGroups.length > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                  <button
                    onClick={navigatePrev}
                    disabled={atFirst || currentChangeIdx === -1}
                    className="text-xs border rounded px-1.5 py-0.5 bg-background hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous change"
                  >↑</button>
                  <button
                    onClick={navigateNext}
                    disabled={atLast}
                    className="text-xs border rounded px-1.5 py-0.5 bg-background hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next change"
                  >↓</button>
                </>
              )}
              <button
                onClick={() => handleCopy(modified)}
                className="text-xs border rounded px-2 py-0.5 bg-background hover:bg-muted transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          {/* Minimap column header spacer */}
          <div className="w-5 shrink-0 bg-muted/50 border-l" />
        </div>
      )}

      {/* Content + minimap */}
      <div className="flex">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto font-mono text-sm"
          style={{ maxHeight: CONTAINER_HEIGHT }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-2 sticky top-0 z-10">
            <div className="px-3 py-1.5 bg-muted text-xs font-semibold text-muted-foreground border-r border-b">
              Original
            </div>
            <div className="px-3 py-1.5 bg-muted text-xs font-semibold text-muted-foreground border-b">
              Modified
            </div>
          </div>

          {rows.map(({ left, right, lNum, rNum }, i) => (
            <div
              key={i}
              ref={(el) => { if (el) rowRefs.current[i] = el; }}
              className="grid grid-cols-2"
              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 1.625rem" }}
            >
              <div className={`flex min-h-[1.625rem] border-r border-b ${rowBg(left.type)}`}>
                <span className={`${gutterWidth} text-right pr-2 text-muted-foreground/50 select-none border-r text-xs flex items-center justify-end shrink-0`}>
                  {lNum}
                </span>
                <span className="px-2 py-0.5 whitespace-pre-wrap break-all leading-snug">{left.text}</span>
              </div>
              <div className={`flex min-h-[1.625rem] border-b ${rowBg(right.type)}`}>
                <span className={`${gutterWidth} text-right pr-2 text-muted-foreground/50 select-none border-r text-xs flex items-center justify-end shrink-0`}>
                  {rNum}
                </span>
                <span className="px-2 py-0.5 whitespace-pre-wrap break-all leading-snug">{right.text}</span>
              </div>
            </div>
          ))}
        </div>
        <Minimap rows={rows} scrollRef={scrollRef} />
      </div>
    </div>
  );
}

function InlineDiffView({ parts }) {
  const hasChanges = parts.some((p) => p.added || p.removed);

  if (!hasChanges) {
    return (
      <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <span className="font-medium">No differences found.</span> Both texts are identical.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-3 text-sm px-3 py-2 border-b bg-muted/50">
        <span className="font-semibold text-green-700">
          +{parts.filter((p) => p.added).reduce((s, p) => s + p.value.length, 0)} added
        </span>
        <span className="font-semibold text-red-700">
          -{parts.filter((p) => p.removed).reduce((s, p) => s + p.value.length, 0)} removed
        </span>
      </div>
      <div className="p-4 font-mono text-sm whitespace-pre-wrap break-words leading-relaxed bg-muted/20">
        {parts.map((part, i) => {
          if (part.added) {
            return (
              <mark key={i} className="bg-green-100 text-green-900 rounded-[2px] not-italic">
                {part.value}
              </mark>
            );
          }
          if (part.removed) {
            return (
              <mark key={i} className="bg-red-100 text-red-900 line-through rounded-[2px] not-italic">
                {part.value}
              </mark>
            );
          }
          return <span key={i}>{part.value}</span>;
        })}
      </div>
    </div>
  );
}

const DiffCheckerText = () => {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [mode, setMode] = useState("lines");
  const [viewMode, setViewMode] = useState("split");
  const [result, setResult] = useState(null);
  const [compared, setCompared] = useState(false);

  const handleCompare = useCallback(() => {
    const parts = getDiff(original, modified, mode);
    setResult(parts);
    setCompared(true);
  }, [original, modified, mode]);

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setResult(null);
    setCompared(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Mode + view selectors */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => { setMode(m.value); setCompared(false); setResult(null); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                mode === m.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode === "lines" && (
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {["split", "inline"].map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                  viewMode === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm mb-2 flex font-medium leading-none">Original</label>
          <textarea
            value={original}
            onChange={(e) => { setOriginal(e.target.value); setCompared(false); }}
            className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            rows={12}
            placeholder="Paste original text here..."
          />
        </div>
        <div>
          <label className="text-sm mb-2 flex font-medium leading-none">Modified</label>
          <textarea
            value={modified}
            onChange={(e) => { setModified(e.target.value); setCompared(false); }}
            className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            rows={12}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCompare}
          disabled={!original && !modified}
          className="c__button c__button--secondary c__button__size--small disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="c__button__content"><span>Compare</span></div>
        </button>
        {compared && (
          <button onClick={handleClear} className="c__button c__button--secondary c__button__size--small">
            <div className="c__button__content"><span>Clear</span></div>
          </button>
        )}
      </div>

      {/* Results */}
      {compared && result && (
        mode === "lines" && viewMode === "split" ? (
          <SplitDiffView parts={result} original={original} modified={modified} />
        ) : (
          <InlineDiffView parts={result} />
        )
      )}
    </div>
  );
};

export default DiffCheckerText;
