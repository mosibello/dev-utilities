import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import BrokenLinkChecker from "@/components/partials/BrokenLinkChecker";
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
                Broken Link Checker
              </Heading>
              <Paragraph className={`u__h6`}>
                Check page URLs for broken links and review the link text, target URL, status, and source page.
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <BrokenLinkChecker />
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
                Use this broken link checker to scan page URLs and find links that return errors or fail to load. Paste URLs directly or use a JSON-style array. Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use the Broken Link Checker
              </Heading>
              <Paragraph>
                Paste one or more page URLs, choose whether to check only internal links or include external links too, then click Check links.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Supported Input
              </Heading>
              <Paragraph>
                Supports page URLs entered line by line or pasted as an array of URLs. Duplicate and invalid URLs are ignored before the check runs.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Link Scope
              </Heading>
              <Paragraph>
                Use Internal only to check links on the same domain as each source page. Use Internal + external to check both same-domain links and links pointing to other websites.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Reading the Results
              </Heading>
              <Paragraph>
                Results are grouped by source page. Each broken link shows the HTTP status or request error, the link text, the target URL, and whether the link is internal or external.
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
    meta_title: `Broken Link Checker | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `Paste page URLs and check for broken internal or external links. Review source pages, link text, target URLs, and HTTP statuses.`,
    slug: {
      current: `broken-link-checker`,
    },
  };
  if (!data) return {};
  return getMetaData(data);
};
