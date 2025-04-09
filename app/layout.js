import "@/styles/index.scss";
import "./globals.css";
import Layout from "@/components/wrappers/Layout";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { AppWrapper } from "@/context/AppWrapper";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

export const pacaembu = localFont({
  src: "../public/fonts/Pacaembu.woff2",
  variable: "--t-font-family-global",
});

export const metadata = {
  title: "Open Source Developer Tools | Free Utilities | Bokhari Loves You",
  description:
    "I love to create. Here are fast, free, open source, ad-free tools. Simplify your coding tasks with utilities like Base64 encode/decode, URL encode/decode, HEX to RGB converter, Timestamp to Date converter, and more.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${pacaembu.variable}`}>
        {/* <NextTopLoader
          color="var(--t-primary-branding-color)"
          showSpinner={false}
          height={2}
          zIndex={999999}
        /> */}
        <AppWrapper>
          <Layout>{children}</Layout>
        </AppWrapper>
        <Toaster position="top-center" />
      </body>
      <GoogleAnalytics gaId="G-CRRQ82QWDD" />
    </html>
  );
}
