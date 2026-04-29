import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import DiffCheckerText from "@/components/partials/DiffCheckerText";
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
                Diff Checker — Text
              </Heading>
              <Paragraph className={`u__h6`}>
                Compare text by lines, words, or characters. Fast, free, open source, ad-free.
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div className="c__util-container" style={{ maxWidth: "1200px" }}>
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <DiffCheckerText />
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
                Use this diff checker to compare two pieces of text and see exactly what changed. Supports line-by-line, word-by-word, and character-by-character comparison. Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use the Text Diff Checker
              </Heading>
              <Paragraph>
                Paste your original text on the left and your modified text on the right. Choose a comparison mode — Lines, Words, or Characters — then click Compare.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Line Mode
              </Heading>
              <Paragraph>
                Compares text line by line and shows a side-by-side split view. Great for comparing code, config files, or prose documents.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Word Mode
              </Heading>
              <Paragraph>
                Highlights individual words that were added or removed. Useful for spotting edits in paragraphs.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Character Mode
              </Heading>
              <Paragraph>
                Shows every single character that changed. Perfect for catching subtle spelling or punctuation differences.
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
    meta_title: `Diff Checker — Text | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `Compare two pieces of text and see exactly what changed. Supports line-by-line, word-by-word, and character-by-character comparison. Free, open source, no ads.`,
    slug: {
      current: `diff-checker-text`,
    },
  };
  if (!data) return {};
  return getMetaData(data);
};
