import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Spinner from "../ui/Spinner";

const LoaderIndex = () => {
  return (
    <Bounded className="b__size-fit-to-screen flex flex-col justify-center items-center h-full w-full">
      <Container>
        <Spinner />
      </Container>
    </Bounded>
  );
};

export default LoaderIndex;
