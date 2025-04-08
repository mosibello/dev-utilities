"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import UserAvatar from "@/components/ui/UserAvatar";
import Link from "next/link";
import { rootURL } from "@/lib/constants";
import { Masonry } from "masonic";
import slugify from "slugify";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

const GalleryGrid = ({ media, startIndex, stopIndex }) => {
  return (
    <>
      {/* {media && media.length > 0 && (
        <div className="mx-auto">
          <Masonry
            items={media}
            render={MasonryCard}
            maxColumnCount={3}
            columnGutter={16}
            rowGutter={0}
            onRender={(startIndex, stopIndex, media)}
          />
        </div>
      )} */}
      <div className="row c__gallery-grid__row">
        {media.map((elem, index) => {
          return (
            <div key={index} className="col-md-6 col-lg-4">
              <SimpleImageCard data={elem} index={index} />
            </div>
          );
        })}
      </div>
    </>
  );
};

const MasonryCard = ({ index, data: elem }) => {
  const slug = `${
    elem?.title ? slugify(elem.title.toLowerCase()) : `unnamed-photo`
  }-${elem.id}`;
  return (
    <article
      key={index}
      className="c__masonry-card relative mb-4 u__cursor-pointer bg-gray-100 rounded-lg"
    >
      <Image
        src={elem.source}
        alt={elem.title}
        width="1000"
        height="1000"
        className="w-full h-auto rounded-lg"
      />
      <div className="absolute inset-0 rounded-lg transition-opacity duration-200 bg-black/40 opacity-0 hover:opacity-100">
        <Link
          href={`${rootURL}/photo/${slug}`}
          className="u__full-cover-anchor u__z-index-5"
        >
          <span className="sr-only">View image</span>
        </Link>
        <div className="c__masonry-card__content-wrapper absolute bottom-0 left-0 right-0 p-4">
          <div className="row">
            <div className="col-6">
              <Link
                href={`${rootURL}/@${elem?.author?.username_handle}`}
                className="u__inherited-anchor c__masonry-card__avatar-anchor u__z-index-10 relative"
              >
                <div className="c__masonry-card__avatar-row">
                  <div className="c__masonry-card__avatar-row__col">
                    <UserAvatar initials={elem?.author?.first_name[0]} />
                  </div>
                  <div className="c__masonry-card__avatar-row__col">
                    <span className="text-white u__p u__f-700 truncate">
                      {elem?.author?.first_name} {elem?.author?.last_name}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const SimpleImageCard = ({ index, data: elem, loading }) => {
  const slug = `${
    elem?.title ? slugify(elem.title.toLowerCase()) : `unnamed-photo`
  }-${elem?.id}`;
  return (
    <>
      <article
        key={index}
        className="c__simple-image-card relative u__cursor-pointer bg-gray-100 rounded-lg"
      >
        {loading && (
          <>
            <Skeleton className="w-full h-auto rounded-lg c__simple-image-card__image c__simple-image-card__image--skeleton" />
          </>
        )}
        {!loading && (
          <>
            <Image
              src={elem.source}
              alt={elem.title}
              width="1000"
              height="1000"
              className="w-full h-auto rounded-lg c__simple-image-card__image object-cover"
            />
            {/* <span className="help-text">{slug}</span> */}
            <div className="absolute inset-0 rounded-lg transition-opacity duration-200 bg-black/40 opacity-0 hover:opacity-100">
              <Link
                href={`${rootURL}/photo/${slug}`}
                className="u__full-cover-anchor u__z-index-5"
              >
                <span className="sr-only">View image</span>
              </Link>
              <div className="c__simple-image-card__content-wrapper absolute bottom-0 left-0 right-0 p-4">
                <div className="row">
                  <div className="col-6">
                    <Link
                      href={`${rootURL}/@${elem?.author?.username_handle}`}
                      className="u__inherited-anchor c__simple-image-card__avatar-anchor u__z-index-10 relative"
                    >
                      <div className="c__simple-image-card__avatar-row">
                        <div className="c__simple-image-card__avatar-row__col">
                          <UserAvatar
                            initials={
                              elem?.author?.first_name
                                ? elem?.author?.first_name[0]
                                : "U"
                            }
                          />
                        </div>
                        <div className="c__simple-image-card__avatar-row__col">
                          <span className="text-white u__p u__f-700 truncate">
                            {elem?.author?.first_name} {elem?.author?.last_name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </article>
    </>
  );
};

export default GalleryGrid;
