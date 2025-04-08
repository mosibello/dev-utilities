"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/wrappers/Container";
import Link from "next/link";
import { rootURL } from "@/lib/constants";

const ProfileNavigation = ({ profile }) => {
  const pathname = usePathname();
  return (
    <Container>
      <div className="c__tabular-navigation">
        <div className="c__tabular-navigation__row">
          <div className="c__tabular-navigation__col">
            <div
              className={`c__tabular-navigation__item ${
                pathname === `/@${profile}`
                  ? "c__tabular-navigation__item--active"
                  : ""
              }`}
            >
              <Link
                // scroll={false}
                className="u__h6"
                href={`${rootURL}/@${profile}`}
              >
                Gallery
              </Link>
            </div>
          </div>
          <div className="c__tabular-navigation__col">
            <div
              className={`c__tabular-navigation__item ${
                pathname === `/@${profile}/likes`
                  ? "c__tabular-navigation__item--active"
                  : ""
              }`}
            >
              <Link
                // scroll={false}
                className="u__h6"
                href={`${rootURL}/@${profile}/likes`}
              >
                Likes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfileNavigation;
