import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import JsonFormatter from "@/components/modules/JsonFormatter";

export default async function JsonFormatterIndex() {
  return (
    <>
      <Bounded className="b__size-fit-to-screen b__hero_variant01 relative">
        <div className="pt-[4rem] pb-[4rem]">
          <Container>
            <div className="text-center c__util-container">
              <div className="c__branding-square mb-[1.5rem]">
                <div className="c__branding-square__icon">😴</div>
              </div>
              <Heading tag={`h1`} className={`u__h2`}>
                JSON formatter
              </Heading>
              <Paragraph className={`u__h6`}>
                Fast, free, open source, ad-free tools.
              </Paragraph>
            </div>
          </Container>
          <Container className="mt-[3rem]">
            <div className="c__util-container">
              <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
                <JsonFormatter />
              </div>
            </div>
          </Container>
          <Container className="mt-[2rem]">
            <div className="c__util-container">
              <Paragraph>
                You can use this JSON formatter to beautify your JSON and make
                it easier to read. Just paste your minified JSON and get the
                formatted result. Made with 💜.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                How to Use JSON Online Formatter
              </Heading>
              <Paragraph>
                Whether you're debugging or doing data analysis, with this JSON
                editor you can quickly format JSON files by copying and pasting
                - no signup required.
              </Paragraph>
              <Paragraph>
                Our tool's built-in JSON Validator ensures the output is
                syntactically correct and adheres to JSON standards. So, you can
                reliably use the data in your applications.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                Benefits of Formatting JSON
              </Heading>
              <Paragraph>
                JSON (JavaScript Object Notation) is an easy-to-read data format
                that both people and computers can understand. Formatting JSON
                improves readability and helps in debugging.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Readability
              </Heading>
              <Paragraph>
                Our tool's built-in JSON Validator ensures the output is
                syntactically correct and adheres to JSON standards. So, you can
                reliably use the data in your applications.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Data Analysis
              </Heading>
              <Paragraph>
                Beautified JSON helps in analyzing data structures and
                relationships more effectively.
              </Paragraph>
              <Heading tag="h3" className="u__subtitle mt-[1rem]">
                Data Interchange
              </Heading>
              <Paragraph>
                Well-structured JSON is easier to share and collaborate on with
                team members.
              </Paragraph>
              <Heading className="u__h5 mt-[2rem] mb-[1rem]">
                JSON Validator
              </Heading>
              <Paragraph>
                When formatting JSON, it's crucial to ensure the accuracy and
                integrity of the data. Our tool's built-in JSON Validator
                ensures the output is syntactically correct and adheres to JSON
                standards. So, you can reliably use the data in your
                applications.
              </Paragraph>
            </div>
          </Container>
        </div>
      </Bounded>
    </>
  );
}
