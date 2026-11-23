import { normalizeSiteUrl } from "@/lib/site";
import sitemap from "@/app/sitemap";
import { buildPageMetadata } from "@/lib/seo";

test("normalizeSiteUrl trims, strips trailing slashes, and falls back for dev", () => {
  expect(normalizeSiteUrl(" https://example.com/ ")).toBe("https://example.com");
  expect(normalizeSiteUrl("https://example.com///")).toBe("https://example.com");
  expect(normalizeSiteUrl("   ")).toBe("http://localhost:3000");
  expect(normalizeSiteUrl(undefined)).toBe("http://localhost:3000");
});

test("sitemap includes available property detail URLs as absolute URLs", () => {
  const urls = sitemap().map((entry) => entry.url);

  expect(urls.every((url) => /^https?:\/\//.test(url))).toBe(true);
  expect(urls.some((url) => /\/properties\/[^/]+$/.test(url))).toBe(true);
});

test("buildPageMetadata uses absolute canonical and Open Graph URLs", () => {
  const metadata = buildPageMetadata({
    title: "Sell",
    description: "Desc",
    path: "/sell",
  });

  expect(metadata.alternates?.canonical).toMatch(/^https?:\/\/.+\/sell$/);
  expect(metadata.openGraph?.url).toMatch(/^https?:\/\/.+\/sell$/);
});
