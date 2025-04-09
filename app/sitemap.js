import fs from "fs";
import path from "path";
import { rootURL } from "@/lib/constants.js";

// Function to recursively get all page.js files
function getPageFiles(dir, baseDir = dir) {
  let routes = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      file !== "api" &&
      !file.startsWith("_") &&
      !file.startsWith(".")
    ) {
      // Recursively scan subdirectories, excluding api routes, private folders, and hidden folders
      routes = [...routes, ...getPageFiles(filePath, baseDir)];
    } else if (
      (file === "page.js" || file === "page.tsx") &&
      !dir.includes("(") && // Skip route groups
      !dir.includes("@") // Skip parallel routes
    ) {
      // Found a page file, convert file path to route
      let route = dir.replace(baseDir, "").replace(/\\/g, "/");
      if (!route) route = ""; // Root route

      // Get the last modified time of the page file
      const pageFilePath = path.join(dir, file);
      const lastModified = fs.statSync(pageFilePath).mtime;

      routes.push({ route, lastModified });
    }
  }

  return routes;
}

export default function sitemap() {
  // Get the absolute path to the app directory
  const appDirectory = path.join(process.cwd(), "app");

  // Get all routes from the app directory
  const routesWithDates = getPageFiles(appDirectory);

  // Convert routes to sitemap entries
  const sitemap = routesWithDates.map(({ route, lastModified }) => ({
    url: `${rootURL}${route}`,
    lastModified,
    // changeFrequency: "weekly",
    // priority: route === "/" ? 1 : 0.8,
  }));

  return sitemap;
}
