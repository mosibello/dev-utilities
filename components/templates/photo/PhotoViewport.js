"use client";
import React, { useState } from "react";
import Container from "@/components/wrappers/Container";
import Bounded from "@/components/wrappers/Bounded";
import UserAvatar from "@/components/ui/UserAvatar";
import Heading from "@/components/ui/Heading";
import Link from "next/link";
import { rootURL } from "@/lib/constants";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { POST__likePhoto } from "@/services/actions";
import { loginPageUrl } from "@/lib/constants";
import Paragraph from "@/components/ui/Paragraph";
import { getCategoryLabel } from "@/lib/helpers";

const PhotoViewport = ({ data }) => {
  const [hasLiked, setHasLiked] = useState({
    loading: false,
    status: data?.userLikeStatus?.data ? true : false,
  });
  const { photo } = data;
  const userId = data?.userId;
  const photoId = photo?.id;

  const handleLike = async () => {
    if (!userId) {
      if (typeof window !== "undefined") {
        window.location.href = loginPageUrl;
        return false;
      }
    }
    setHasLiked((prevState) => ({
      ...prevState,
      loading: true,
    }));
    const likePhoto = await POST__likePhoto(
      hasLiked.status ? `deleteLike` : `insertLike`,
      userId,
      photoId
    );
    setHasLiked((prevState) => ({
      status: !prevState.status,
      loading: false,
    }));
  };

  // console.log(photo);

  return (
    <Bounded className="b__size-sm b__photo__viewport">
      <Container>
        <div className="b__photo__viewport__header">
          <div className="row b__photo__viewport__header__row justify-between">
            <div className="col-lg-6">
              <div className="b__photo__viewport__header__avatar-wrapper">
                <div className="c__avatar-row">
                  <div className="c__avatar-row__col">
                    <Link
                      href={`${rootURL}/@${photo?.author?.username_handle}`}
                    >
                      <UserAvatar initials={photo?.author?.first_name[0]} />
                    </Link>
                  </div>
                  <div className="c__avatar-row__col">
                    <Link
                      href={`${rootURL}/@${photo?.author?.username_handle}`}
                      className="u__inherited-anchor c__avatar-row__anchor u__z-index-10 relative"
                    >
                      <span className="u__p u__f-600 truncate">
                        {photo?.author?.first_name} {photo?.author?.last_name}
                      </span>
                    </Link>
                    <br />
                    <span className="u__p u__f-600 u__text-light u__text-light--with-hover cursor-pointer">
                      Follow
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="b__photo__viewport__header__actions-wrapper">
                <div className="b__photo__viewport__header__actions-row">
                  {/* <div className="b__photo__viewport__header__actions-col">
                    <Button
                      title={`Collect`}
                      size={`default`}
                      actionable
                      theme={`ghost-secondary`}
                    />
                  </div> */}
                  <div className="b__photo__viewport__header__actions-col">
                    <Button
                      title={hasLiked.status ? `Liked` : `Like`}
                      size={`default`}
                      actionable
                      theme={`secondary`}
                      className={hasLiked.status ? `c__button--liked` : ``}
                      icon={`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /> </svg>`}
                      iconPosition={`before`}
                      onClick={() => handleLike()}
                      isLoading={hasLiked.loading}
                    />
                  </div>
                  <div className="b__photo__viewport__header__actions-col">
                    <Button
                      title={`Free Download`}
                      size={`default`}
                      className={``}
                      destination={photo.source}
                      target={`_blank`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="b__photo__viewport__main">
          <div className="b__photo__viewport__main__image-wrapper">
            <Image
              src={photo.source}
              alt={photo.title}
              sizes="100%"
              fill={true}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        {photo?.title && <Paragraph>{`Title: ${photo.title}`}</Paragraph>}
        {photo?.description && (
          <Paragraph>{`Description: ${photo.description}`}</Paragraph>
        )}
        {photo?.categories && (
          <Paragraph disableParse>
            Categories:{" "}
            {photo.categories.map((elem, idx) => {
              return (
                <span key={idx}>
                  {getCategoryLabel(elem)}
                  {idx === photo.categories.length - 1 ? `` : `, `}
                </span>
              );
            })}
          </Paragraph>
        )}
      </Container>
    </Bounded>
  );
};

export default PhotoViewport;
