/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    loader: "custom",
    loaderFile: "components/ui/ImageLoader.js",
    domains: [
      "23219927.fs1.hubspotusercontent-na1.net",
      "ik.imagekit.io",
      "hencvadqoefxvinlzdgs.supabase.co",
    ],
  },
};

export default nextConfig;
