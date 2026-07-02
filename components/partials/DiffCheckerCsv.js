"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ChevronDown, ChevronUp } from "lucide-react";

function parseCsvText(text) {
  const result = Papa.parse(text.trim(), {
    header: false,
    skipEmptyLines: true,
  });
  return result.data;
}

function parseFile(file) {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();
    if (name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          resolve(parseCsvText(e.target.result));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          resolve(data.filter((row) => row.some((cell) => cell !== "")));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file type. Please upload a CSV or Excel file."));
    }
  });
}

function cellChanged(a, b) {
  return String(a ?? "").trim() !== String(b ?? "").trim();
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

function normalizeCell(value) {
  return String(value ?? "").trim();
}

function findRowKeyColumn(leftData, rightData, ignoredCols, headers = []) {
  const maxCols = Math.max(
    0,
    ...leftData.map((r) => r.length),
    ...rightData.map((r) => r.length),
    headers.length
  );
  let best = null;

  for (let c = 0; c < maxCols; c++) {
    if (ignoredCols.has(c)) continue;

    const leftValues = leftData.map((row) => normalizeCell(row[c])).filter(Boolean);
    const rightValues = rightData.map((row) => normalizeCell(row[c])).filter(Boolean);
    if (!leftValues.length || !rightValues.length) continue;

    const leftSet = new Set(leftValues);
    const rightSet = new Set(rightValues);
    if (leftSet.size !== leftValues.length || rightSet.size !== rightValues.length) continue;

    const overlap = [...leftSet].filter((value) => rightSet.has(value)).length;
    const overlapRatio = overlap / Math.min(leftSet.size, rightSet.size);
    if (overlapRatio < 0.5) continue;

    const header = normalizeCell(headers[c]).toLowerCase();
    let score = overlapRatio * 100 + overlap;
    if (/^(id|.*_id|.*id)$/.test(header)) score += 60;
    if (/(^|_)(key|slug|path|sku|code)($|_)/.test(header)) score += 35;
    if (/(^|_)(name|title)($|_)/.test(header)) score += 10;
    if (c === 0) score += 8;

    if (!best || score > best.score) {
      best = { index: c, score, label: headers[c] || `Col ${c + 1}` };
    }
  }

  return best;
}

function buildCells(leftRow, rightRow, maxCols, ignoredCols) {
  const cells = [];
  let rowHasDiff = false;

  for (let c = 0; c < maxCols; c++) {
    const ignored = ignoredCols.has(c);
    const lv = leftRow[c] ?? "";
    const rv = rightRow[c] ?? "";
    const changed = !ignored && cellChanged(lv, rv);
    if (changed) rowHasDiff = true;
    cells.push({ left: lv, right: rv, changed, ignored });
  }

  return { cells, rowHasDiff };
}

function createDiffRow({
  leftRow = [],
  rightRow = [],
  leftIndex = null,
  rightIndex = null,
  maxCols,
  ignoredCols,
}) {
  const { cells, rowHasDiff } = buildCells(leftRow, rightRow, maxCols, ignoredCols);
  const rowAdded = leftIndex === null && rightIndex !== null;
  const rowRemoved = leftIndex !== null && rightIndex === null;

  return {
    cells,
    rowHasDiff: rowHasDiff || rowAdded || rowRemoved,
    rowChanged: rowHasDiff && !rowAdded && !rowRemoved,
    rowAdded,
    rowRemoved,
    originalIndex: leftIndex,
    modifiedIndex: rightIndex,
  };
}

function computeDiffByKey(leftData, rightData, ignoredCols, maxCols, keyCol) {
  const leftByKey = new Map();
  leftData.forEach((row, index) => {
    leftByKey.set(normalizeCell(row[keyCol]), { row, index });
  });

  const matchedLeft = new Set();
  const rows = rightData.map((rightRow, rightIndex) => {
    const key = normalizeCell(rightRow[keyCol]);
    const match = leftByKey.get(key);

    if (!match) {
      return createDiffRow({ rightRow, rightIndex, maxCols, ignoredCols });
    }

    matchedLeft.add(match.index);
    return createDiffRow({
      leftRow: match.row,
      rightRow,
      leftIndex: match.index,
      rightIndex,
      maxCols,
      ignoredCols,
    });
  });

  leftData.forEach((leftRow, leftIndex) => {
    if (!matchedLeft.has(leftIndex)) {
      rows.push(createDiffRow({ leftRow, leftIndex, maxCols, ignoredCols }));
    }
  });

  return rows;
}

function computeDiffByPosition(leftData, rightData, ignoredCols, maxCols) {
  const maxRows = Math.max(leftData.length, rightData.length);
  const rows = [];

  for (let r = 0; r < maxRows; r++) {
    rows.push(
      createDiffRow({
        leftRow: leftData[r] || [],
        rightRow: rightData[r] || [],
        leftIndex: r < leftData.length ? r : null,
        rightIndex: r < rightData.length ? r : null,
        maxCols,
        ignoredCols,
      })
    );
  }

  return rows;
}

function computeDiff(leftData, rightData, ignoredCols, headers = []) {
  const maxCols = Math.max(
    0,
    ...leftData.map((r) => r.length),
    ...rightData.map((r) => r.length),
    headers.length
  );
  const keyColumn = findRowKeyColumn(leftData, rightData, ignoredCols, headers);
  const rows = keyColumn
    ? computeDiffByKey(leftData, rightData, ignoredCols, maxCols, keyColumn.index)
    : computeDiffByPosition(leftData, rightData, ignoredCols, maxCols);

  return { rows, maxCols, keyColumn };
}

function DropZone({ label, onData, onError }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState("upload");
  const fileRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      try {
        const data = await parseFile(file);
        setFileName(file.name);
        onData(data);
      } catch (err) {
        onError(err.message);
      }
    },
    [onData, onError]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePasteChange = (e) => {
    const val = e.target.value;
    setText(val);
    if (val.trim()) {
      try {
        const data = parseCsvText(val);
        onData(data);
        onError(null);
      } catch {
        onError("Could not parse CSV text.");
      }
    } else {
      onData(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none">{label}</label>
        <div className="flex gap-1 p-0.5 bg-muted rounded-md">
          <button
            onClick={() => setInputMode("paste")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              inputMode === "paste"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Paste CSV
          </button>
          <button
            onClick={() => setInputMode("upload")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              inputMode === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {inputMode === "paste" ? (
        <textarea
          value={text}
          onChange={handlePasteChange}
          className="flex min-h-[80px] w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
          rows={10}
          placeholder={"name,age,city\nAlice,30,NYC\nBob,25,LA"}
        />
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleFile(file);
            }}
          />
          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{fileName}</span>
              <span className="text-xs text-muted-foreground">Click to change file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <span className="text-sm font-medium text-foreground">Drop a file here</span>
                <span className="text-sm text-muted-foreground"> or click to browse</span>
              </div>
              <span className="text-xs">CSV, XLSX, XLS supported</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ColumnIgnoreSelector({ headers, ignoredCols, onToggle }) {
  if (!headers.length) return null;
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <p className="text-sm font-medium mb-3">Ignore columns in comparison:</p>
      <div className="flex flex-wrap gap-2">
        {headers.map((col, idx) => {
          const ignored = ignoredCols.has(idx);
          return (
            <button
              key={idx}
              onClick={() => onToggle(idx)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                ignored
                  ? "bg-muted text-muted-foreground border-border line-through"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {col || `Col ${idx + 1}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DiffTable({ diffResult, headers }) {
  const { rows, maxCols } = diffResult;
  const colHeaders = Array.from({ length: maxCols }, (_, i) => headers[i] || `Col ${i + 1}`);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);
  const [activeDiffIndex, setActiveDiffIndex] = useState(0);
  const rowRefs = useRef({});
  const tableScrollRef = useRef(null);
  const headerRowRef = useRef(null);
  const [headerRowHeight, setHeaderRowHeight] = useState(0);

  const diffRowIndexes = useMemo(
    () => rows.map((row, index) => (row.rowHasDiff ? index : null)).filter((index) => index !== null),
    [rows]
  );
  const visibleRows = showOnlyDiffs
    ? rows.map((row, index) => ({ row, index })).filter(({ row }) => row.rowHasDiff)
    : rows.map((row, index) => ({ row, index }));

  const addedRows = rows.filter((r) => r.rowAdded).length;
  const removedRows = rows.filter((r) => r.rowRemoved).length;
  const changedRows = rows.filter((r) => r.rowChanged).length;
  const hasAnyDiff = rows.some((r) => r.rowHasDiff);

  useEffect(() => {
    const headerRow = headerRowRef.current;
    if (!headerRow) return;

    const updateHeaderHeight = () => {
      setHeaderRowHeight(headerRow.getBoundingClientRect().height);
    };

    updateHeaderHeight();

    if (typeof ResizeObserver === "undefined") return;
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(headerRow);

    return () => resizeObserver.disconnect();
  }, [colHeaders.length]);

  const scrollToDiff = (direction) => {
    if (!diffRowIndexes.length) return;
    const nextIndex = (activeDiffIndex + direction + diffRowIndexes.length) % diffRowIndexes.length;
    const rowIndex = diffRowIndexes[nextIndex];
    const row = rowRefs.current[rowIndex];
    const scrollContainer = tableScrollRef.current;

    setActiveDiffIndex(nextIndex);
    if (!row || !scrollContainer) return;

    const pageScrollX = window.scrollX;
    const pageScrollY = window.scrollY;

    scrollContainer.scrollTo({
      top: row.offsetTop - scrollContainer.clientHeight / 2 + row.clientHeight / 2,
      behavior: "smooth",
    });

    window.scrollTo(pageScrollX, pageScrollY);
    window.requestAnimationFrame(() => window.scrollTo(pageScrollX, pageScrollY));
  };

  return (
    <div className="flex flex-col gap-4">
      {!hasAnyDiff ? (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <span className="font-medium">No differences found.</span> Both datasets are identical (excluding ignored columns).
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 text-sm">
          {changedRows > 0 && (
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded px-2.5 py-1">
              <span className="font-bold">{changedRows}</span> changed {pluralize(changedRows, "row")}
            </span>
          )}
          {addedRows > 0 && (
            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded px-2.5 py-1">
              <span className="font-bold">+{addedRows}</span> added {pluralize(addedRows, "row")}
            </span>
          )}
          {removedRows > 0 && (
            <span className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 rounded px-2.5 py-1">
              <span className="font-bold">-{removedRows}</span> removed {pluralize(removedRows, "row")}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            checked={showOnlyDiffs}
            onChange={(e) => setShowOnlyDiffs(e.target.checked)}
            className="rounded border-border"
          />
          Show differences only
        </label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {diffResult.keyColumn && (
            <span className="hidden sm:inline">
              Matched by <span className="font-medium text-foreground">{diffResult.keyColumn.label}</span>
            </span>
          )}
          <span>
            {diffRowIndexes.length ? activeDiffIndex + 1 : 0} / {diffRowIndexes.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scrollToDiff(-1)}
              disabled={!diffRowIndexes.length}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous difference"
              title="Previous difference"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToDiff(1)}
              disabled={!diffRowIndexes.length}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next difference"
              title="Next difference"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div ref={tableScrollRef} className="max-h-[70vh] overflow-auto rounded-lg border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr ref={headerRowRef} className="bg-muted">
              <th className="sticky top-0 z-30 bg-muted px-2 py-2 text-xs text-muted-foreground font-medium border-r border-b w-8 text-center">#</th>
              {colHeaders.map((h, i) => {
                const isIgnored = rows[0]?.cells[i]?.ignored;
                return (
                  <th
                    key={i}
                    colSpan={2}
                    className={`sticky top-0 z-20 bg-muted px-3 py-2 text-xs font-medium border-r border-b text-left ${
                      isIgnored ? "text-muted-foreground/50" : "text-muted-foreground"
                    }`}
                  >
                    {h}
                    {isIgnored && <span className="ml-1 text-[10px]">(ignored)</span>}
                  </th>
                );
              })}
            </tr>
            <tr className="bg-muted/50">
              <th
                className="sticky z-30 bg-muted/95 border-r border-b"
                style={{ top: `${headerRowHeight}px` }}
              />
              {colHeaders.map((_, i) => (
                <React.Fragment key={i}>
                  <th
                    className="sticky z-20 bg-muted/95 px-2 py-1 text-[10px] text-muted-foreground font-normal border-r border-b"
                    style={{ top: `${headerRowHeight}px` }}
                  >
                    Original
                  </th>
                  <th
                    className="sticky z-20 bg-muted/95 px-2 py-1 text-[10px] text-muted-foreground font-normal border-r border-b"
                    style={{ top: `${headerRowHeight}px` }}
                  >
                    Modified
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(({ row, index }) => {
              const rowBg = row.rowAdded
                ? "bg-green-50"
                : row.rowRemoved
                ? "bg-red-50"
                : "";
              const visibleNumber = row.modifiedIndex ?? row.originalIndex ?? index;
              const rowChangedCellClass = row.rowChanged
                ? "shadow-[inset_0_1px_0_rgb(251_191_36_/_0.8),inset_0_-1px_0_rgb(251_191_36_/_0.8)]"
                : "";
              const rowChangedEdgeClass = row.rowChanged
                ? "border-l-2 border-l-amber-400"
                : "";
              return (
                <tr
                  key={index}
                  ref={(node) => {
                    if (node) rowRefs.current[index] = node;
                  }}
                  className={`${rowBg} hover:bg-muted/20 transition-colors`}
                >
                  <td className={`px-2 py-1.5 text-xs text-muted-foreground border-r border-b text-center font-mono ${rowChangedCellClass} ${rowChangedEdgeClass}`}>
                    {visibleNumber + 1}
                  </td>
                  {row.cells.map((cell, ci) => (
                    <React.Fragment key={ci}>
                      <td
                        className={`px-2 py-1.5 border-r border-b font-mono text-xs max-w-[200px] truncate ${rowChangedCellClass} ${
                          cell.changed ? "bg-red-50 text-red-900" : cell.ignored ? "opacity-40" : ""
                        }`}
                        title={String(cell.left ?? "")}
                      >
                        {String(cell.left ?? "")}
                      </td>
                      <td
                        className={`px-2 py-1.5 border-r border-b font-mono text-xs max-w-[200px] truncate ${rowChangedCellClass} ${
                          cell.changed ? "bg-green-50 text-green-900" : cell.ignored ? "opacity-40" : ""
                        }`}
                        title={String(cell.right ?? "")}
                      >
                        {String(cell.right ?? "")}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DiffCheckerCsv = () => {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [leftError, setLeftError] = useState(null);
  const [rightError, setRightError] = useState(null);
  const [ignoredCols, setIgnoredCols] = useState(new Set());
  const [diffResult, setDiffResult] = useState(null);
  const [compared, setCompared] = useState(false);
  const [hasHeader, setHasHeader] = useState(true);

  const headers = leftData && leftData.length > 0 && hasHeader ? leftData[0].map(String) : [];

  const effectiveLeft = leftData ? (hasHeader ? leftData.slice(1) : leftData) : [];
  const effectiveRight = rightData ? (hasHeader ? rightData.slice(1) : rightData) : [];

  const handleToggleCol = (idx) => {
    setIgnoredCols((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
    setCompared(false);
    setDiffResult(null);
  };

  const handleCompare = () => {
    if (!leftData || !rightData) return;
    const result = computeDiff(effectiveLeft, effectiveRight, ignoredCols, headers);
    setDiffResult(result);
    setCompared(true);
  };

  const handleClear = () => {
    setLeftData(null);
    setRightData(null);
    setDiffResult(null);
    setCompared(false);
    setIgnoredCols(new Set());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Options */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => { setHasHeader(e.target.checked); setCompared(false); setDiffResult(null); }}
            className="rounded border-border"
          />
          First row is a header
        </label>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DropZone
          label="Original"
          onData={(data) => { setLeftData(data); setCompared(false); setDiffResult(null); setLeftError(null); }}
          onError={setLeftError}
        />
        <DropZone
          label="Modified"
          onData={(data) => { setRightData(data); setCompared(false); setDiffResult(null); setRightError(null); }}
          onError={setRightError}
        />
      </div>

      {(leftError || rightError) && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {leftError || rightError}
        </div>
      )}

      {/* Column ignore selector */}
      {leftData && headers.length > 0 && (
        <ColumnIgnoreSelector
          headers={headers}
          ignoredCols={ignoredCols}
          onToggle={handleToggleCol}
        />
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCompare}
          disabled={!leftData || !rightData}
          className="c__button c__button--secondary c__button__size--small disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="c__button__content">
            <span>Compare</span>
          </div>
        </button>
        {compared && (
          <button onClick={handleClear} className="c__button c__button--secondary c__button__size--small">
            <div className="c__button__content">
              <span>Clear</span>
            </div>
          </button>
        )}
      </div>

      {/* Result */}
      {compared && diffResult && (
        <DiffTable diffResult={diffResult} headers={headers} />
      )}
    </div>
  );
};

export default DiffCheckerCsv;
