import React from "react";
import parse from "html-react-parser";

const Paragraph = ({ children, className = "u__p", tag, disableParse }) => {
  const ParagraphTag = tag ? tag : `p`;
  return (
    <>
      <ParagraphTag className={`c__paragraph ${className} mb-3`}>
        {disableParse
          ? children
          : children.includes("<span")
          ? parse(children)
          : parse(children)}
      </ParagraphTag>
    </>
  );
};

export default Paragraph;
