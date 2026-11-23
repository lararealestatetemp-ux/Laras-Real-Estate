import type { Metadata } from "next";
import { Libre_Franklin, Source_Sans_3 } from "next/font/google";

import { BUSINESS_NAME, TAGLINE } from "@/lib/constants";

import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-display-loaded",
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS_NAME,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description: TAGLINE,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${libreFranklin.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
