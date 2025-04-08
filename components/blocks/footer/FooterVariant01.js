import Container from "@/components/wrappers/Container";
import { organization } from "@/lib/constants";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="u__border-top u__bg-white py-3">
          <Container className="text-center">
            <p className="mb-0" style={{ fontSize: `0.85rem` }}>
              © Copyright{" "}
              <a href="/" className="">
                {organization || ``}
              </a>{" "}
              {new Date().getFullYear()}
            </p>
          </Container>
        </div>
      </footer>
    </>
  );
};

export default Footer;
