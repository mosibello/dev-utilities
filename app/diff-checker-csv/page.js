import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import DiffCheckerCsv from "@/components/partials/DiffCheckerCsv";
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
                Diff Checker — CSV
              </Heading>
              <Paragraph className={`u__h6`}>
                Compare CSV, Excel, or Google Sheet data. Ignore specific columns. Fast, free, open source, ad-free.
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <DiffCheckerCsv />
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
                Use this CSV diff checker to compare two spreadsheets or CSV exports and see exactly which rows and cells changed. Upload files directly or paste CSV text. Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use the CSV Diff Checker
              </Heading>
              <Paragraph>
                Upload or paste your original and modified CSV data, optionally mark the first row as a header, then select any columns to ignore before clicking Compare.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Supported Formats
              </Heading>
              <Paragraph>
                Supports CSV files, Excel files (.xlsx, .xls), and plain CSV text pasted directly. Export from Google Sheets as CSV and paste or upload here.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Ignoring Columns
              </Heading>
              <Paragraph>
                Click any column name in the &quot;Ignore columns&quot; panel to exclude it from the comparison. Ignored columns are still shown in the diff table but are grayed out.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Reading the Results
              </Heading>
              <Paragraph>
                Red cells show values that were removed or changed in the original; green cells show the new or added values. Fully added or removed rows are highlighted row-wide.
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
    meta_title: `Diff Checker — CSV & Excel | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `Compare two CSV, Excel, or Google Sheet exports and see exactly which rows and cells changed. Ignore specific columns. Free, open source, no ads.`,
    slug: {
      current: `diff-checker-csv`,
    },
  };
  if (!data) return {};
  return getMetaData(data);
};
