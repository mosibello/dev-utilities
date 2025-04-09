import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import JsonFormatter from "@/components/modules/JsonFormatter";
import Button from "@/components/ui/Button";

export default async function Home() {
  const data = [
    {
      heading: `JSON Formatter`,
      description: `Format and beautify your JSON data for better readability and debugging. Quickly visualize and organize your JSON data with ease.`,
      destination: `/json-formatter`,
    },
  ];

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
                Dev Utilities
              </Heading>
              <Paragraph className={`u__h6`}>
                Below are some fast, free, open source, ad-free tools.
              </Paragraph>
            </div>
          </Container>

          <Container className="mt-[2.5rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((elem) => {
              const { heading, description, destination } = elem;
              return (
                <>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-1 u__position-relative u__transition u__translate">
                    <div className="p-6 items-baseline flex flex-col">
                      <Heading tag="h2" className="u__h4 mb-[0.75rem]">
                        {heading}
                      </Heading>
                      <Paragraph className="mb-[2rem]">{description}</Paragraph>
                      <Button
                        theme={`secondary`}
                        title={`Try It`}
                        destination={destination}
                        size="small"
                        className="u__full-cover-anchor-psuedo"
                      />
                    </div>
                  </div>
                </>
              );
            })}
          </Container>
        </div>
      </Bounded>
    </>
  );
}
