import React from "react";

const Heading = ({ children, className = "u__h1", tag }) => {
  const HeadingTag = tag ? tag : `h2`;
  return (
    <>
      <HeadingTag
        className={`c__heading ${className} u__font-weight-heading mb-[0.5rem] d-block`}
      >
        {children}
      </HeadingTag>
    </>
  );
};

export default Heading;
