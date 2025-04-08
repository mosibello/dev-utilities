import { cn } from "@/lib/utils";
import React from "react";

const Spinner = ({ visible, variant }) => {
  return (
    <div className={`c__spinner-wrapper--viewport ${visible ? `` : `d-none`}`}>
      <div className="c__spinner-parent">
        {variant === "shadcn" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin")}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Spinner;
