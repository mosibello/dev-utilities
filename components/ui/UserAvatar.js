import React from "react";

const UserAvatar = ({ initials }) => {
  return (
    <div className="c__user-avatar">
      <div className="c__user-avatar__wrapper">
        {initials && (
          <div className="c__user-avatar__text uppercase">{initials}</div>
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
