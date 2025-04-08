import React from "react";
import Heading from "./Heading";
import Paragraph from "./Paragraph";

const AuthCard = ({
  children,
  heading = `Sign in`,
  description = `Create an account if you do not have an existing one by entering
            your email address below`,
}) => {
  return (
    <div className="c__auth-card">
      <div className="c__auth-card__wrapper">
        <div className="c__auth-card__content-wrapper mb-[2rem]">
          {heading && (
            <Heading tag="h1" className="u__h4 mb-[1rem]">
              {heading}
            </Heading>
          )}
          {description && <Paragraph>{description}</Paragraph>}
        </div>
        <div className="c__auth-card__form-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default AuthCard;
