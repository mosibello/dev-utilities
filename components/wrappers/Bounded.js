import React from "react";

const Bounded = ({ type, className, id, children, ...restProps }) => {
  return (
    <section
      id={id ? `bounded-section-id-${id}` : null}
      data-block-type={type && parse(type)}
      className={className}
      {...restProps}
    >
      {children}
    </section>
  );
};

export default Bounded;
