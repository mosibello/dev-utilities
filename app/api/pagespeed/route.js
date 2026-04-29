const ALLOWED_STRATEGIES = ["mobile", "desktop"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const strategy = searchParams.get("strategy") || "mobile";

  if (!url) {
    return Response.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (!ALLOWED_STRATEGIES.includes(strategy)) {
    return Response.json({ error: "Invalid strategy" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", strategy);
  apiUrl.searchParams.set("category", "performance");
  if (apiKey) apiUrl.searchParams.set("key", apiKey);

  try {
    const res = await fetch(apiUrl.toString(), {
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    let data;
    try {
      data = await res.json();
    } catch {
      return Response.json(
        { error: `PageSpeed API returned non-JSON response (HTTP ${res.status})` },
        { status: 502 }
      );
    }

    if (!res.ok) {
      const message = data?.error?.message || `PageSpeed API error (HTTP ${res.status})`;
      return Response.json({ error: message }, { status: res.status });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: `Could not reach PageSpeed API: ${err?.message ?? "network error"}` },
      { status: 502 }
    );
  }
}
