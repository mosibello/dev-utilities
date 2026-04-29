import { notFound } from "next/navigation";
import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import PageSpeedReportView from "@/components/partials/PageSpeedReportView";
import { rootURL } from "@/lib/constants";

async function getReport(id) {
  const res = await fetch(`${rootURL}/api/pagespeed-save?id=${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;
  return data;
}

export default async function ReportPage({ params }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  return (
    <Bounded className="b__size-fit-to-screen b__hero_variant01 relative">
      <div className="pt-[4rem] pb-[4rem]">
        <Container>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="mb-2">
              <a
                href="/pagespeed-test"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors no-underline"
              >
                ← Back to PageSpeed Test
              </a>
            </div>
            <Heading tag="h1" className="u__h4 mb-1">
              {report.label || "Page Speed Report"}
            </Heading>
          </div>
        </Container>

        <Container className="mt-[2rem]">
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
              <PageSpeedReportView report={report} />
            </div>
          </div>
        </Container>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const report = await getReport(id);
  const title = report?.label
    ? `${report.label} — Page Speed Report`
    : `Page Speed Report — ${report?.url ?? ""}`;
  return {
    title,
    description: `Page Speed Insights report for ${report?.url ?? ""}`,
  };
}
