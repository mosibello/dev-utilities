import React from "react";
import { SimpleImageCard } from "@/components/ui/GalleryGrid.js";

const GalleryGrid = ({ count = 6 }) => {
  return (
    <>
      <div className="row c__gallery-grid__row">
        {Array(count)
          .fill(null)
          .map((elem, index) => {
            return (
              <div key={index} className="col-md-6 col-lg-4">
                <SimpleImageCard data={null} index={index} loading />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default GalleryGrid;
