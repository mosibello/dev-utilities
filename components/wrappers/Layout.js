import React from "react";
import HeaderVariant01 from "@/components/blocks/header/HeaderVariant01";
import Footer from "@/components/blocks/footer/FooterVariant01";
import { SCHEMA__DummyMenu } from "@/lib/schema";

const Layout = async ({ children }) => {
  return (
    <>
      <HeaderVariant01 />
      <main id="main-content" className="overflow-hidden">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
