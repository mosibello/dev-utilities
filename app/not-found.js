import Heading from "@/components/ui/Heading";
import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";

const NotFoundPage = () => {
  return (
    <>
      <Bounded className="b__misc__HeroError01 b__auth__variant01 ">
        <Container>
          <div className="container">
            <div className="text-center">
              <Heading tag="h1" className="u__d2" disableParse={true}>
                <span className="u__text-branding-primary">404.</span> Not
                Found.
              </Heading>
            </div>
          </div>
        </Container>
      </Bounded>
    </>
  );
};

export default NotFoundPage;
