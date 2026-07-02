"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Label, Textarea } from "@/components/ui/FormElements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";

const EXAMPLE_URLS = [
  "https://www.taylor.com/case-study/tony-awards-helping-to-create-lasting-memories",
  "https://www.taylor.com/locations/marketing-solutions-minneapolis-mn-6075-trenton-lane-n-suite-100",
  "https://www.taylor.com/video/conversations-with-glen-taylor-season-3-episode-7-0",
  "https://www.taylor.com/case-study/fitness-club-combines-sustainability-with-privacy",
  "https://www.taylor.com/case-study/girard-perregaux-celebrating-a-milestone-anniversary",
  "https://www.taylor.com/blog/direct-mail-effectiveness-in-2026",
  "https://www.taylor.com/blog/sustainable-cold-chain-packaging-solutions-are-in-demand",
  "https://www.taylor.com/case-study/trisource-exhibits-providing-solutions-behind-the-scenes",
  "https://www.taylor.com/research/why-print-management",
  "https://www.taylor.com/podcast",
];

function parseUrlInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Fall through to loose parsing for pasted JS-style arrays with trailing commas.
    }
  }

  return trimmed
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(/\n|,(?=\s*["']?https?:\/\/)/)
    .map((line) => line.trim().replace(/^["']|["'],?$|["']$/g, ""))
    .filter(Boolean);
}

function uniqueValidUrls(urls) {
  const seen = new Set();

  return urls.filter((url) => {
    try {
      const parsed = new URL(url);
      const valid = ["http:", "https:"].includes(parsed.protocol);
      if (!valid || seen.has(parsed.toString())) return false;
      seen.add(parsed.toString());
      return true;
    } catch {
      return false;
    }
  });
}

function statusLabel(link) {
  if (link.status) return link.status;
  return link.error || "Failed";
}

function ResultLinksTable({ links, showResult, disableRowHover = false }) {
  if (!links.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="bg-muted/30 text-left text-xs text-muted-foreground">
            {showResult && (
              <th className="border-b border-r px-3 py-2 font-medium">Result</th>
            )}
            <th className="border-b border-r px-3 py-2 font-medium">Status</th>
            <th className="border-b border-r px-3 py-2 font-medium">Link text</th>
            <th className="border-b border-r px-3 py-2 font-medium">URL</th>
            <th className="border-b px-3 py-2 font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, index) => {
            const passed = link.ok;
            return (
              <tr
                key={`${link.url}-${index}`}
                className={`${disableRowHover ? "" : "hover:bg-muted/20"} ${
                  passed ? "bg-green-50/70" : "bg-red-50/70"
                }`}
              >
                {showResult && (
                  <td
                    className={`whitespace-nowrap border-b border-r px-3 py-2 text-xs font-medium ${
                      passed ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {passed ? "Passed" : "Broken"}
                  </td>
                )}
                <td
                  className={`whitespace-nowrap border-b border-r px-3 py-2 font-mono text-xs ${
                    passed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {statusLabel(link)}
                </td>
                <td className="border-b border-r px-3 py-2">
                  {link.text || <span className="text-muted-foreground">(no text)</span>}
                </td>
                <td className="border-b border-r px-3 py-2">
                  <a
                    className={`inline-flex max-w-[520px] items-center gap-1 break-all underline-offset-4 hover:underline ${
                      passed ? "text-green-800" : "text-foreground"
                    }`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.url}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </td>
                <td className="whitespace-nowrap border-b px-3 py-2 text-xs text-muted-foreground">
                  {link.internal ? "Internal" : "External"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ResultsSummary({ result }) {
  if (!result) return null;

  const hasBroken = result.brokenLinkCount > 0 || result.pagesWithBrokenLinks.length > 0;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 text-sm ${
        hasBroken
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      {hasBroken ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      <span className="font-medium">
        {hasBroken ? "Broken links found" : "No broken links found"}
      </span>
      <span>{result.sourceUrlCount} pages</span>
      <span>{result.checkedLinkCount} links checked</span>
      <span>{result.brokenLinkCount} broken</span>
    </div>
  );
}

function CheckedLinksModal({ page, onOpenChange }) {
  const [hidePassedLinks, setHidePassedLinks] = useState(false);
  const links = page?.links ?? [];
  const brokenCount = page?.brokenLinks?.length ?? 0;
  const visibleLinks = hidePassedLinks && brokenCount > 0
    ? links.filter((link) => !link.ok)
    : links;

  return (
    <Dialog open={Boolean(page)} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0">
        {page && (
          <>
            <DialogHeader className="border-b px-4 py-3 pr-12">
              <DialogTitle>Checked links</DialogTitle>
              <DialogDescription asChild>
                <a
                  className="block break-all text-xs underline-offset-4 hover:underline"
                  href={page.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {page.pageUrl}
                </a>
              </DialogDescription>
            </DialogHeader>
            {brokenCount > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/20 px-4 py-2">
                <span className="text-xs text-muted-foreground">
                  {brokenCount} broken of {links.length} checked links
                </span>
                <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    checked={hidePassedLinks}
                    onChange={(event) => setHidePassedLinks(event.currentTarget.checked)}
                    className="rounded border-border"
                  />
                  Hide passed links
                </label>
              </div>
            )}
            <div className="overflow-auto">
              {visibleLinks.length > 0 ? (
                <ResultLinksTable links={visibleLinks} showResult disableRowHover />
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No links to show.
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BrokenLinkTable({ result }) {
  const [selectedPage, setSelectedPage] = useState(null);

  if (!result) return null;

  if (!result.pagesWithBrokenLinks.length) {
    return (
      <>
        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center gap-2 border-b border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">All checked links passed.</span>
          </div>
          {result.pages.map((page) => (
            <div
              key={page.pageUrl}
              className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-3 py-2 text-sm last:border-b-0 hover:bg-muted/20"
            >
              <a
                className="min-w-0 flex-1 break-all font-medium text-foreground underline-offset-4 hover:underline"
                href={page.pageUrl}
                target="_blank"
                rel="noreferrer"
              >
                {page.pageUrl}
              </a>
              <div className="flex flex-wrap items-center gap-2">
                <span className="whitespace-nowrap rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  Passed · {page.checkedLinks} link{page.checkedLinks === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPage(page)}
                  className="whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Show Details
                </button>
              </div>
            </div>
          ))}
        </div>
        <CheckedLinksModal
          page={selectedPage}
          onOpenChange={(open) => {
            if (!open) setSelectedPage(null);
          }}
        />
      </>
    );
  }

  const pagesWithResults = result.pages.filter(
    (page) => page.pageStatus === "error" || page.links?.length || page.brokenLinks?.length
  );

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        {pagesWithResults.map((page) => {
          const brokenCount = page.brokenLinks?.length ?? 0;
          const checkedCount = page.checkedLinks ?? 0;
          const passedCount = Math.max(checkedCount - brokenCount, 0);
          const pageFailed = page.pageStatus === "error";

          return (
            <div
              key={page.pageUrl}
              className="flex flex-wrap items-center justify-between gap-3 border-b bg-background px-3 py-2 text-sm last:border-b-0 hover:bg-muted/20"
            >
              <a
                className="min-w-0 flex-1 break-all font-medium text-foreground underline-offset-4 hover:underline"
                href={page.pageUrl}
                target="_blank"
                rel="noreferrer"
              >
                {page.pageUrl}
              </a>
              <div className="flex flex-wrap items-center gap-2">
                {pageFailed ? (
                  <span className="whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                    Page error
                  </span>
                ) : (
                  <>
                    {brokenCount > 0 && (
                      <span className="whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        Broken · {brokenCount}
                      </span>
                    )}
                    <span className="whitespace-nowrap rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      Passed · {passedCount}
                    </span>
                  </>
                )}
                {page.links?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedPage(page)}
                    className="whitespace-nowrap rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Show Details
                  </button>
                )}
              </div>
              {pageFailed && (
                <p className="basis-full text-xs text-red-700">{page.pageError}</p>
              )}
            </div>
          );
        })}
      </div>
      <CheckedLinksModal
        page={selectedPage}
        onOpenChange={(open) => {
          if (!open) setSelectedPage(null);
        }}
      />
    </>
  );
}

const BrokenLinkChecker = () => {
  const [input, setInput] = useState("");
  const [scope, setScope] = useState("internal");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const urls = useMemo(() => uniqueValidUrls(parseUrlInput(input)), [input]);
  const rawUrlCount = useMemo(() => parseUrlInput(input).length, [input]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!urls.length) {
      setError("Please paste at least one valid http(s) URL.");
      return;
    }

    setIsChecking(true);

    try {
      const response = await fetch("/api/broken-link-checker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ urls, scope }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not run broken link check.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Could not run broken link check.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleLoadExample = () => {
    setInput(JSON.stringify(EXAMPLE_URLS, null, 2));
    setResult(null);
    setError("");
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <Label name="broken-link-url-input">Page URLs</Label>
        <Textarea
          name="broken-link-url-input"
          rows="12"
          value={input}
          onChange={(event) => {
            setInput(event.currentTarget.value);
            setResult(null);
            setError("");
          }}
          placeholder={'https://example.com/page-one\nhttps://example.com/page-two'}
          className="flex min-h-[220px] w-full rounded-lg border border-input bg-muted px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {urls.length} valid URL{urls.length === 1 ? "" : "s"}
            {rawUrlCount > urls.length ? ` (${rawUrlCount - urls.length} ignored)` : ""}
          </span>
          <button
            type="button"
            onClick={handleLoadExample}
            className="rounded-md border bg-background px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-muted"
          >
            Load example
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/30 p-1">
        <button
          type="button"
          onClick={() => setScope("internal")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            scope === "internal"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Internal only
        </button>
        <button
          type="button"
          onClick={() => setScope("all")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            scope === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Internal + external
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          actionable
          type="submit"
          theme="secondary"
          size="small"
          title={isChecking ? "Checking" : "Check links"}
          isLoading={isChecking}
          isDisabled={isChecking || !urls.length}
        />
        {result && (
          <button
            type="button"
            onClick={() => setResult(null)}
            className="c__button c__button--secondary c__button__size--small"
          >
            <div className="c__button__content">
              <span>Clear results</span>
            </div>
          </button>
        )}
      </div>

      {isChecking && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking {urls.length} page{urls.length === 1 ? "" : "s"}...</span>
        </div>
      )}

      <ResultsSummary result={result} />
      <BrokenLinkTable result={result} />
    </form>
  );
};

export default BrokenLinkChecker;
