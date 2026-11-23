import type { Metadata } from "next";

import { BUSINESS_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site";

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(input.path);

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${input.title} | ${BUSINESS_NAME}`,
      description: input.description,
      url,
      siteName: BUSINESS_NAME,
      type: "website",
    },
  };
}
