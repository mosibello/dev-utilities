import React from "react";

const StickyBottomDrawer = ({ children }) => {
  return (
    <div className="c__sticky-bottom-drawer">
      <div className="c__sticky-bottom-drawer__content-wrapper">{children}</div>
    </div>
  );
};

export default StickyBottomDrawer;
