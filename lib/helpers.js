import { SCHEMA__imageCategories } from "@/lib/schema";

export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const getTotalNumberOfPaginatedPages = (
  totalNumberOfPosts,
  paginatedItemsPerPage
) => Math.ceil(totalNumberOfPosts / paginatedItemsPerPage);

export const isLastPaginatedPage = (totalNumberOfPaginatedPages, activePage) =>
  totalNumberOfPaginatedPages === activePage;

export const getPaginationContext = async (
  query,
  paginatedItemsPerPage,
  activePage
) => {
  const totalNumberOfPosts = await query;
  const totalNumberOfPaginatedPages = getTotalNumberOfPaginatedPages(
    totalNumberOfPosts,
    paginatedItemsPerPage
  );
  const lastPaginatedPage = isLastPaginatedPage(
    totalNumberOfPaginatedPages,
    activePage
  );
  return {
    totalNumberOfPosts,
    totalNumberOfPaginatedPages,
    lastPaginatedPage,
  };
};

export const checkValidJSONString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const checkValidJS = (str) => {
  try {
    new Function(`${str}`)();
  } catch (e) {
    return false;
  }
  return true;
};

export function formatBytes(bytes, opts = {}) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`;
}

export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * max) + min;

export const getCategoryLabel = (value) => {
  const category = SCHEMA__imageCategories.find((cat) => cat.value === value);
  return category ? category.label : null;
};

export function convertQueryParamsToJSON(input) {
  let inputString = input;

  if (!input.includes("://")) {
    inputString = input.startsWith("?")
      ? `https://example.com${input}`
      : `https://example.com?${input}`;
  }

  const url = new URL(inputString);
  const intermediateResult = {};

  url.searchParams.forEach((value, key) => {
    if (intermediateResult[key]) {
      if (Array.isArray(intermediateResult[key])) {
        intermediateResult[key].push(value);
      } else {
        intermediateResult[key] = [intermediateResult[key], value];
      }
    } else {
      intermediateResult[key] = value;
    }
  });

  const sortedKeys = Object.keys(intermediateResult).sort();
  const result = {};

  sortedKeys.forEach((key) => {
    result[key] = intermediateResult[key];
  });

  return JSON.stringify(result, null, 2);
}
