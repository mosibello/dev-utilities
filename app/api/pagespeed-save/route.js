import { createClient } from "@libsql/client";

function getDb() {
  const url = process.env.VALTOWN_DB_URL;
  const authToken = process.env.VALTOWN_DB_TOKEN;
  if (!url || !authToken) throw new Error("VALTOWN_DB_URL or VALTOWN_DB_TOKEN is not configured");
  return createClient({ url, authToken });
}

export async function POST(request) {
  let db;
  try {
    db = getDb();
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, label, url, runs, mobile, desktop } = body;
  if (!id || !url) {
    return Response.json({ error: "Missing required fields: id, url" }, { status: 400 });
  }

  try {
    await db.execute({
      sql: `INSERT INTO pagespeed_reports (id, label, url, runs, mobile, desktop, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        label ?? null,
        url,
        runs ?? 0,
        mobile ? JSON.stringify(mobile) : null,
        desktop ? JSON.stringify(desktop) : null,
        new Date().toISOString(),
      ],
    });
    return Response.json({ ok: true, id });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }
}

export async function GET(request) {
  let db;
  try {
    db = getDb();
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });

  try {
    const result = await db.execute({
      sql: "SELECT id, label, url, runs, mobile, desktop, created_at FROM pagespeed_reports WHERE id = ?",
      args: [id],
    });

    if (!result.rows?.length) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    const row = result.rows[0];
    return Response.json({
      id: row.id,
      label: row.label,
      url: row.url,
      runs: row.runs,
      created_at: row.created_at,
      mobile: row.mobile ? JSON.parse(row.mobile) : null,
      desktop: row.desktop ? JSON.parse(row.desktop) : null,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }
}
