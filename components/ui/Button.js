import Link from "next/link";
import React from "react";
import parse from "html-react-parser";

const Button = ({
  title,
  destination,
  icon,
  iconPosition,
  target,
  className,
  linkClassName,
  theme = `primary`,
  size = `default`,
  actionable,
  type,
  onClick,
  isLoading,
  isDisabled,
}) => {
  return (
    <>
      {actionable ? (
        <>
          {title && (
            <button
              onClick={onClick}
              type={type}
              className={`c__button c__button--${theme} 
              ${icon ? `c__button--has-icon` : ``}  
              ${
                iconPosition === `before`
                  ? `c__button--has-icon--prev`
                  : `c__button--has-icon--after`
              }
              ${className ? className : ``} c__button__size--${size} ${
                isLoading ? `c__button--loading` : ``
              } ${isDisabled ? `c__button--disabled` : ``}`}
            >
              <div className="c__button__content">
                {icon && iconPosition === "before" && (
                  <>
                    <figure className="c__button__icon c__button__icon--before">
                      {parse(icon)}
                    </figure>
                  </>
                )}
                <span>{title}</span>
                {icon && iconPosition === "after" && (
                  <>
                    <figure className="c__button__icon c__button__icon--after">
                      {parse(icon)}
                    </figure>
                  </>
                )}
                <figure className="c__button__loading-icon">
                  <svg className="c__spinner" viewBox="0 0 50 50">
                    <circle
                      className="path"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      strokeWidth="5"
                    ></circle>
                  </svg>
                </figure>
              </div>
            </button>
          )}
        </>
      ) : (
        <>
          {title && (
            <Link
              className={`c__button__anchor-element ${
                linkClassName ? linkClassName : ``
              }`}
              href={destination || "#"}
              target={target || `_self`}
            >
              <span
                className={`c__button c__button--${theme} 
              ${icon ? `c__button--has-icon` : ``}  
              ${
                iconPosition === `before`
                  ? `c__button--has-icon--prev`
                  : `c__button--has-icon--after`
              }
                ${className ? className : ``} c__button__size--${size}`}
              >
                <div className="c__button__content">
                  {icon && iconPosition === "before" && (
                    <>
                      <figure className="c__button__icon c__button__icon--before">
                        {parse(icon)}
                      </figure>
                    </>
                  )}
                  <span>{title}</span>
                  {icon && iconPosition === "after" && (
                    <>
                      <figure className="c__button__icon c__button__icon--after">
                        {parse(icon)}
                      </figure>
                    </>
                  )}
                </div>
              </span>
            </Link>
          )}
        </>
      )}
    </>
  );
};

export default Button;
