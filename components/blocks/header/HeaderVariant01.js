"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { organization } from "@/lib/constants";
import Container from "@/components/wrappers/Container";

const HeaderVariant01 = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <header className="b__header__variant01 b__header__variant01--sticky">
        <Container>
          <Button
            linkClassName="c__button--skip-to-content"
            theme="primary"
            title={`Skip to Content`}
            destination={`#main-content`}
          />
          <div className="b__header__variant01__wrapper">
            <Link
              className="u__text-decoration-none u__inherited-anchor"
              href="/"
            >
              <div className="b__header__variant01__logo-wrapper u__cursor-pointer">
                <span className="b__header__variant01__logo u__font-family-heading u__f-700 u__text-branding-primary u__h3 u__letter-spacing--tight">
                  😴 {organization.toLowerCase() || ``}
                </span>
              </div>
            </Link>
            <div className="b__header__variant01__nav-wrapper b__header__variant01__nav-wrapper-large">
              <nav className="b__header__variant01__nav">
                <>
                  <Button
                    theme={`secondary`}
                    title={`Contribute`}
                    destination={`https://github.com/mosibello/dev-utilities`}
                    target="_blank"
                    size="small"
                  />
                  <div className="ps-3">
                    <Button
                      theme={`secondary`}
                      title={`Back to bokharilovesyou.com`}
                      destination={`https://bokharilovesyou.com/`}
                      target="_blank"
                      size="small"
                    />
                  </div>
                </>
              </nav>
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};

export default HeaderVariant01;
