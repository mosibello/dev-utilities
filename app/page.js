import React from "react";
import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";

export default async function Home() {
  return (
    <>
      <Bounded className="b__size-md b__hero_variant01 relative">
        <Container className="text-center">
          <Heading>Hello</Heading>
        </Container>
      </Bounded>
    </>
  );
}
