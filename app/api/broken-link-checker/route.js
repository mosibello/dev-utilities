const MAX_SOURCE_URLS = 50;
const MAX_LINKS_PER_PAGE = 300;
const REQUEST_TIMEOUT_MS = 12000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; BokhariDevUtilitiesBrokenLinkChecker/1.0)";

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    gt: ">",
    lt: "<",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  return String(value ?? "").replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const lower = entity.toLowerCase();
    if (lower[0] === "#") {
      const isHex = lower[1] === "x";
      const codePoint = parseInt(lower.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return named[lower] ?? match;
  });
}

function stripHtml(value) {
  return decodeHtmlEntities(String(value ?? "").replace(/<[^>]*>/g, " "));
}

function getAttribute(tag, attribute) {
  const pattern = new RegExp(
    `(?:^|\\s)${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`,
    "i"
  );
  const match = tag.match(pattern);
  return decodeHtmlEntities(match?.[2] ?? match?.[3] ?? match?.[4] ?? "");
}

function isSkippableHref(href) {
  const value = href.trim().toLowerCase();
  return (
    !value ||
    value === "#" ||
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("sms:") ||
    value.startsWith("javascript:") ||
    value.startsWith("data:")
  );
}

function toAbsoluteUrl(href, pageUrl) {
  try {
    return new URL(href, pageUrl).toString();
  } catch {
    return null;
  }
}

function withoutHash(url) {
  const parsed = new URL(url);
  parsed.hash = "";
  return parsed.toString();
}

function isInternalLink(linkUrl, pageUrl) {
  return new URL(linkUrl).hostname === new URL(pageUrl).hostname;
}

function extractLinks(html, pageUrl, scope) {
  const anchors = [];
  const seen = new Set();
  const anchorPattern = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorPattern.exec(html)) !== null && anchors.length < MAX_LINKS_PER_PAGE) {
    const tag = match[0];
    const href = getAttribute(tag, "href");
    if (isSkippableHref(href)) continue;

    const absoluteUrl = toAbsoluteUrl(href, pageUrl);
    if (!absoluteUrl) continue;

    let normalizedUrl;
    try {
      normalizedUrl = withoutHash(absoluteUrl);
      if (!["http:", "https:"].includes(new URL(normalizedUrl).protocol)) continue;
    } catch {
      continue;
    }

    const internal = isInternalLink(normalizedUrl, pageUrl);
    if (scope === "internal" && !internal) continue;

    const linkText = normalizeWhitespace(stripHtml(match[1])) || normalizeWhitespace(href);
    const dedupeKey = `${normalizedUrl}\u001f${linkText}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    anchors.push({
      text: linkText,
      url: normalizedUrl,
      internal,
    });
  }

  return anchors;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        ...(options.headers ?? {}),
      },
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPage(url) {
  const response = await fetchWithTimeout(url, { method: "GET" });
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new Error(`Page returned ${response.status}`);
  }

  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error(`Page is not HTML (${contentType || "unknown content type"})`);
  }

  return response.text();
}

async function checkUrl(url) {
  let response;

  try {
    response = await fetchWithTimeout(url, { method: "HEAD" });
    if ([403, 405, 429].includes(response.status)) {
      response = await fetchWithTimeout(url, { method: "GET" });
    }
  } catch (headError) {
    try {
      response = await fetchWithTimeout(url, { method: "GET" });
    } catch (getError) {
      return {
        ok: false,
        status: null,
        finalUrl: url,
        error: getError?.name === "AbortError" ? "Request timed out" : getError.message,
      };
    }
  }

  return {
    ok: response.status < 400,
    status: response.status,
    finalUrl: response.url || url,
    error: null,
  };
}

async function runWithConcurrency(items, limit, iterator) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await iterator(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

function parseUrls(urls) {
  if (!Array.isArray(urls)) return [];

  const seen = new Set();
  return urls
    .map((url) => normalizeWhitespace(url))
    .filter(Boolean)
    .map((url) => {
      try {
        return new URL(url).toString();
      } catch {
        return null;
      }
    })
    .filter((url) => {
      if (!url || seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .slice(0, MAX_SOURCE_URLS);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const sourceUrls = parseUrls(body.urls);
    const scope = body.scope === "all" ? "all" : "internal";

    if (!sourceUrls.length) {
      return Response.json(
        { error: "Please provide at least one valid http(s) URL." },
        { status: 400 }
      );
    }

    const linkStatusCache = new Map();
    const pages = await runWithConcurrency(sourceUrls, 3, async (pageUrl) => {
      const pageResult = {
        pageUrl,
        pageStatus: "ok",
        pageError: null,
        checkedLinks: 0,
        links: [],
        brokenLinks: [],
      };

      let links = [];
      try {
        const html = await fetchPage(pageUrl);
        links = extractLinks(html, pageUrl, scope);
      } catch (error) {
        pageResult.pageStatus = "error";
        pageResult.pageError = error.message;
        return pageResult;
      }

      pageResult.checkedLinks = links.length;

      const checked = await runWithConcurrency(links, 8, async (link) => {
        if (!linkStatusCache.has(link.url)) {
          linkStatusCache.set(link.url, checkUrl(link.url));
        }

        const status = await linkStatusCache.get(link.url);
        return { ...link, ...status };
      });

      pageResult.links = checked;
      pageResult.brokenLinks = checked.filter((link) => !link.ok);
      return pageResult;
    });

    const pagesWithBrokenLinks = pages.filter(
      (page) => page.pageStatus === "error" || page.brokenLinks.length > 0
    );

    return Response.json({
      scope,
      sourceUrlCount: sourceUrls.length,
      checkedLinkCount: pages.reduce((sum, page) => sum + page.checkedLinks, 0),
      brokenLinkCount: pages.reduce((sum, page) => sum + page.brokenLinks.length, 0),
      pagesWithBrokenLinks,
      pages,
      limits: {
        maxSourceUrls: MAX_SOURCE_URLS,
        maxLinksPerPage: MAX_LINKS_PER_PAGE,
      },
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Could not run broken link check." },
      { status: 500 }
    );
  }
}
