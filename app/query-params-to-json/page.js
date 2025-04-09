import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import QueryParamsToJson from "@/components/modules/QueryParamsToJson";
import { getMetaData } from "@/lib/seo";

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
                Query Parameters to JSON
              </Heading>
              <Paragraph className={`u__h6`}>
                Free, Open Source & Ad-free
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div className="c__util-container">
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <QueryParamsToJson />
              </div>
            </div>
          </Container>
          <Container className="mt-[2rem]">
            <div className="c__util-container">
              <Paragraph>
                You can convert URL query parameters into JSON format with this
                free online tool. Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use Query Parameters to JSON Online Converter
              </Heading>
              <Paragraph>
                If you work with web applications, APIs, or data manipulation,
                you can use this Query Params to JSON converter to transform
                query strings into structured JSON objects. Just enter your URL
                query parameters and get the JSON output.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                URL Query to JSON Use Cases
              </Heading>
              <Paragraph>
                Converting URL query parameters into a JSON object simplifies
                data handling and manipulation in web applications.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Data Integration
              </Heading>
              <Paragraph>
                JSON helps merge data from query strings more easily in web
                applications and APIs.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Data Processing
              </Heading>
              <Paragraph>
                JSON is better for working with and converting data in different
                programming languages.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Data Sharing
              </Heading>
              <Paragraph>
                JSON's structured format makes it easier to share and exchange
                data between different systems and platforms.
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
    meta_title: `Query Params to JSON Converter | Free, Open Source & Ad-free | Bokhari Loves You`,
    meta_description: `This free tool is a quick and easy way to convert URL query parameters into JSON format. If you work with web applications, APIs, or data manipulation, you can use Jam's tool to transform query strings into structured JSON objects.`,
    slug: {
      current: `query-params-to-json`,
    },
  };
  if (!data) return {};
  return getMetaData(data);
};
