import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import UrlEncoder from "@/components/partials/UrlEncoder";
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
                URL encoder/decoder
              </Heading>
              <Paragraph className={`u__h6`}>
                Free, Open Source & Ad-free
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div className="c__util-container">
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <UrlEncoder />
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
              <Paragraph disableParse={true}>
                You can encode and decode URLs online with this free tool,
                ensuring proper treatment of special characters, spaces, and
                non-ASCII symbols in web addresses and query strings. <br />
                <br />
                Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use URL Decode Tool
              </Heading>
              <Paragraph>
                Easily handle URL encoding and decoding - in one step. Just
                paste your URL and copy the result!
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How the URL Encoder/Decoder Works
              </Heading>
              <Paragraph>
                This URL encoder changes characters to a safe format for
                transmitting over the internet. This ensures that systems can
                handle special characters, spaces, and symbols in web addresses
                and query strings. For example, spaces are converted to %20, and
                special characters are changed to their respective
                percent-encoded values.
              </Paragraph>
              <Paragraph>
                Transformed URLs help merge data more efficiently in web
                applications and APIs, ensuring data integrity during processing
                in different programming languages. They facilitate easier data
                sharing and exchange between different systems and platforms by
                properly handling cases where a character is percent encoded.
                This includes special characters, non-ASCII symbols, and spaces.
                The tool efficiently manages query strings and key value pairs,
                making it ideal for various web applications.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                Debugging Encoded URLs
              </Heading>
              <Paragraph>
                Decoded URLs are easier to read and necessary to troubleshoot
                issues or understand how data is being passed through query
                strings. Decoded URLs are essential for debugging because they
                reveal the actual values being transmitted.
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
    meta_title: `URL encoder/decoder | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `Easily encode and decode URLs online with this free tool. Handle special characters, spaces, and non-ASCII symbols in web addresses and query strings efficiently.`,
    slug: {
      current: `url-encoder`,
    },
  };
  if (!data) return {};
  return getMetaData(data);
};
