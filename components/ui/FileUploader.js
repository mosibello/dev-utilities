"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import Button from "./Button";
import StickyBottomDrawer from "./StickyBottomDrawer";
import FileEditorCard from "./FileEditorCard";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";
import { toast } from "sonner";
import { formatBytes, getRandomNumber } from "../../lib/helpers";
import { Progress } from "@/components/ui/shadcn/progress";
import { useAppContext } from "@/context/AppWrapper";
import { v4 as uuidv4 } from "uuid";
import { POST__uploadFile, POST__insertPhotos } from "@/services/actions";
import slugify from "slugify";
import { supabaseStorageBucketURL } from "@/lib/constants";
import Container from "@/components/wrappers/Container";
import Heading from "@/components/ui/Heading";
import Paragraph from "@/components/ui/Paragraph";
import Compressor from "compressorjs";

const FileUploader = ({
  onValueChange,
  onUpload,
  accept = {
    "image/*": [],
  },
  maxSize = 1024 * 1024 * 4,
  maxFileCount = 5,
  multiple = false,
  disabled = false,
}) => {
  const formRefs = useRef([]);
  const [files, setFiles] = useState([]);
  const [payloadPosting, setPayloadPosting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [uploadingIntent, setUploadingIntent] = useState(0);
  const [readyToTagfiles, setReadyToTagfiles] = useState(false);
  const [pageContent, setPageContent] = useState({
    heading: `Share your photos and videos, and let the world love them.`,
    description: null,
  });
  const [readyToRedirectOnSuccess, setReadyToRedirectOnSuccess] =
    useState(false);
  const [formValidities, setFormValidities] = useState([]);
  const [allFormsValid, setAllFormsValid] = useState(false);

  const { user } = useAppContext();
  const userId = user?.data?.user?.id;
  const userMetaData = user.data.user.user_metadata;

  const handleUploads = async (e) => {
    e.preventDefault();
    if (!files?.length) return;

    setPayloadPosting(true);
    setUploadingIntent(uploadingIntent + 1);

    const uploadedFileNames = new Set();

    const compressImage = (file) =>
      new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.6,
          maxWidth: 2000,
          maxHeight: 2000,
          success: (compressedFile) => resolve(compressedFile),
          error: (err) => reject(err),
        });
      });

    const uploadProcess = async () => {
      try {
        const uploadPromises = files.map(async (file) => {
          if (uploadedFileNames.has(file.name)) {
            console.log(
              `File ${file.name} is a duplicate and will not be uploaded.`
            );
            return Promise.resolve();
          }

          uploadedFileNames.add(file.name);

          try {
            setProgresses((prevState) => ({
              ...prevState,
              [file.name]: getRandomNumber(5, 20),
            }));

            let fileToUpload = file;
            try {
              fileToUpload = await compressImage(file);
              console.log(`successfully compressed ${file.name}`);
            } catch (compressionError) {
              console.warn(
                `Compression failed for ${file.name}. Proceeding with original file.`,
                compressionError
              );
            }

            const { data, error } = await POST__uploadFile(
              fileToUpload,
              `images`,
              `${userId}/${slugify(file.name).toLowerCase()}-${uuidv4()}`
            );

            if (error) {
              throw new Error(`Upload error: ${error.message}`);
            }

            setUploadedFiles((prevState) => [
              ...prevState,
              {
                name: file.name,
                src: `${supabaseStorageBucketURL}/${data.fullPath}`,
              },
            ]);

            setProgresses((prevState) => ({
              ...prevState,
              [file.name]: 100,
            }));
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            setFormMessage({
              type: `error`,
              message: `Failed to upload ${file.name}: ${error.message}`,
            });
            throw error; // Propagate error to handle in `Promise.all`
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        throw new Error("One or more uploads failed");
      }
    };

    toast.promise(uploadProcess(), {
      loading: "Uploading images...",
      success: () => {
        setTimeout(() => {
          setReadyToTagfiles(true);
          setPayloadPosting(false);
          setPageContent({
            heading: `Make your photos and videos easy to find and be seen.`,
            description: `Add some keywords that describe your photo and what is in it.`,
          });
        }, 500);
        return `${files.length} image(s) uploaded successfully!`;
      },
      error: () => {
        setPayloadPosting(false);
        return "Some images failed to upload. Please try again.";
      },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${maxFileCount} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(
            `File ${file.name} was rejected. Please upload a JPEG or PNG (up to 4MB each)`
          );
        });
      }
    },
    [files, maxFileCount, multiple, onUpload, setFiles]
  );

  function onRemove(index) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  function isFileWithPreview(file) {
    return "preview" in file && typeof file.preview === "string";
  }

  const handleValidityChange = (index, isValid) => {
    setFormValidities((prevValidities) => {
      const updatedValidities = [...prevValidities];
      updatedValidities[index] = isValid;
      setAllFormsValid(updatedValidities.every(Boolean)); // Check if all forms are valid
      return updatedValidities;
    });
  };

  const handlePostPhotos = async () => {
    setPayloadPosting(true);
    const allFormData = formRefs.current.map((ref) =>
      ref?.getFormDataWithCustomValues?.()
    );
    console.log("Collected Form Data:", allFormData);
    try {
      const { data, error } = await POST__insertPhotos(allFormData);
      if (error) {
        throw new Error(`Error: ${error.message}`);
      }
      setPayloadPosting(false);
      setReadyToRedirectOnSuccess(true);
      toast.success(`${allFormData.length} photo(s) have been published! 🎉`, {
        duration: 5000,
      });
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = `/@${userMetaData.username_handle}`;
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setPayloadPosting(false);
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   const areAllValid = formRefs.current.every((ref) => ref?.isValid);
  //   setAllFormsValid(areAllValid);
  //   console.log(allFormsValid);
  // }, [formRefs.current]);

  useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // useEffect(() => {
  //   console.log(uploadedFiles);
  // }, [readyToTagfiles]);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize,
    onDrop,
  });

  return (
    <>
      <Container>
        <div className="mx-auto text-center max-w-[700px]">
          {pageContent?.heading && (
            <Heading className="u__h3 mb-5">{pageContent?.heading}</Heading>
          )}
          {pageContent?.description && (
            <Paragraph className="u__h6">{pageContent?.description}</Paragraph>
          )}
        </div>
      </Container>
      <Container className="mt-[2.5rem]">
        {readyToTagfiles && uploadedFiles.length && (
          <>
            {uploadedFiles.map((elem, index) => {
              return (
                <FileEditorCard
                  ref={(el) => (formRefs.current[index] = el)}
                  className={`mb-[2rem]`}
                  file={elem}
                  key={index}
                  authorId={userId}
                  onValidityChange={(isValid) =>
                    handleValidityChange(index, isValid)
                  }
                />
              );
            })}
            <StickyBottomDrawer>
              <div className="text-center">
                <Button
                  title="Submit Your Content"
                  actionable
                  isLoading={payloadPosting}
                  onClick={() => handlePostPhotos()}
                  theme={`primary`}
                  isDisabled={!allFormsValid || readyToRedirectOnSuccess}
                />
              </div>
            </StickyBottomDrawer>
          </>
        )}

        {!readyToTagfiles && (
          <form onSubmit={handleUploads} autoComplete="off">
            <div className="max-w-[800px] mx-auto">
              <div className="relative flex flex-col gap-6 overflow-hidden px-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isDragActive && "border-muted-foreground/50",
                    isDisabled && "pointer-events-none opacity-60"
                  )}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                      <div className="rounded-full border border-dashed p-3">
                        <Upload
                          className="size-7 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="font-medium text-muted-foreground">
                        Drop the files here
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                      <div className="rounded-full border border-dashed p-3">
                        <Upload
                          className="size-7 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col gap-px">
                        <p className="font-medium text-muted-foreground">
                          Drag {`'n'`} drop files here, or click to select files
                        </p>{" "}
                        <p className="text-sm text-muted-foreground/70">
                          You can upload {maxFileCount} files (up to 4MB each)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {files?.length ? (
                <div className="mt-10">
                  <ScrollArea className="h-fit w-full px-4">
                    <div className="c__lib__scroll-area__content-wrapper flex max-h-48 flex-col gap-4">
                      {files?.map((file, index) => (
                        <div
                          key={index}
                          className="relative flex items-center gap-3.5"
                        >
                          <div className="flex flex-1 gap-2.5">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              width={48}
                              height={48}
                              loading="lazy"
                              className="aspect-square shrink-0 rounded-md object-cover"
                            />
                            <div className="flex w-full flex-col gap-2">
                              <div className="flex flex-col gap-px">
                                <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                                  {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatBytes(file.size)}
                                </p>
                              </div>
                              {progresses?.[file.name] ? (
                                <div className="pr-5">
                                  <Progress value={progresses?.[file.name]} />
                                </div>
                              ) : null}
                            </div>
                            {uploadingIntent < 1 && (
                              <button
                                type="button"
                                className="c__util-button h-[35px]"
                                onClick={() => onRemove(index)}
                              >
                                <X className="size-4" aria-hidden="true" />
                                <span className="sr-only">Remove file</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {files && files.length > 0 && (
                    <div className="mt-10 text-end">
                      <Button
                        actionable
                        title="Upload"
                        type="submit"
                        isLoading={payloadPosting}
                        theme={`secondary`}
                        // isDisabled={!isValid}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </form>
        )}
      </Container>
    </>
  );
};
export default FileUploader;
