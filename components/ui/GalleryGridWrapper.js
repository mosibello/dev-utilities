"use client";
import React, { useState } from "react";
import GalleryGrid from "@/components/ui/GalleryGrid";
import { default as GalleryGridLoader } from "@/components/loaders/GalleryGrid";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/components/ui/Spinner";

const GalleryGridWrapper = ({
  initialMedia,
  initialMediaRange,
  totalCount,
  fetchNext,
  fetchNextParams,
}) => {
  const rangeDifference = initialMediaRange.end - initialMediaRange.start + 1;

  const [media, setMedia] = useState(initialMedia);
  if (!media) {
    return;
  }
  const [mediaRange, setMediaRange] = useState({
    start: media.length,
    end: initialMediaRange.end + media.length,
  });
  const [hasMore, setHasMore] = useState(media.length < totalCount);

  const handleLoadPhotos = async () => {
    try {
      const { photos, error } = await fetchNext(
        mediaRange.start,
        mediaRange.end,
        ...(fetchNextParams ? fetchNextParams : [null])
      );

      if (error) {
        console.error("Error loading photos:", error);
        return;
      }

      if (photos && photos.length > 0) {
        setMedia((prevState) => [...prevState, ...photos]);
        setMediaRange((prevState) => ({
          start: prevState.start + rangeDifference,
          end: prevState.end + rangeDifference,
        }));
        if (media.length + photos.length >= totalCount) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <InfiniteScroll
      dataLength={media.length}
      next={handleLoadPhotos}
      hasMore={hasMore}
      loader={
        <div className="">
          <div className="w-full mt-[1.5rem]">
            <GalleryGridLoader count={3} />
            {/* <Spinner /> */}
          </div>
        </div>
      }
      scrollThreshold={0.8}
      endMessage={``}
    >
      <GalleryGrid
        startIndex={mediaRange.start}
        stopIndex={mediaRange.end}
        media={media}
      />
    </InfiniteScroll>
  );
};

export default GalleryGridWrapper;
