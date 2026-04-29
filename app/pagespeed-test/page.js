import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import PageSpeedTester from "@/components/partials/PageSpeedTester";
import { getMetaData } from "@/lib/seo";
import StaticCTA from "@/components/partials/StaticCTA";

export default async function Page() {
  return (
    <>
      <Bounded className="b__size-fit-to-screen b__hero_variant01 relative">
        <div className="pt-[4rem] pb-[4rem]">
          <Container>
            <div className="text-center c__util-container">
              <div className="c__branding-square mb-[1.5rem]">
                <div className="c__branding-square__icon">😴</div>
              </div>
              <Heading tag={`h1`} className={`u__h3`}>
                PageSpeed Test
              </Heading>
              <Paragraph className={`u__h6`}>
                Run multiple Lighthouse tests via Google PageSpeed Insights and get an averaged score. Fast, free, open source, ad-free.
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <PageSpeedTester />
              </div>
            </div>
          </Container>
          <Container className="mt-[2.5rem]">
            <div className="c__util-container">
              <StaticCTA />
            </div>
          </Container>
          <Container className="mt-[2rem]">
            <div className="c__util-container">
              <Paragraph>
                This tool runs Google Lighthouse via the PageSpeed Insights API multiple times and averages the results, giving you a more reliable performance score than a single run.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">Why run multiple tests?</Heading>
              <Paragraph>
                A single Lighthouse run can vary by 5–15 points depending on server load, network conditions, and timing. Running 3–5 tests and averaging them gives a much more accurate picture of your real-world performance.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">Core Web Vitals explained</Heading>
              <Paragraph disableParse>
                <strong>FCP</strong> (First Contentful Paint) — time until the first content appears. <strong>LCP</strong> (Largest Contentful Paint) — time until the main content loads. <strong>TBT</strong> (Total Blocking Time) — how long the main thread is blocked. <strong>CLS</strong> (Cumulative Layout Shift) — visual stability. <strong>SI</strong> (Speed Index) — how quickly content is visually populated. <strong>TTI</strong> (Time to Interactive) — when the page becomes fully interactive.
              </Paragraph>
            </div>
          </Container>
        </div>
      </Bounded>
    </>
  );
}

export const generateMetadata = async () => {
  const data = {
    meta_title: `PageSpeed Test | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `Run multiple Google Lighthouse tests via PageSpeed Insights and get an averaged performance score for mobile and desktop. Free, open source, no ads.`,
    slug: { current: `pagespeed-test` },
  };
  if (!data) return {};
  return getMetaData(data);
};
