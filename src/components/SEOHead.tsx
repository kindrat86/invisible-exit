import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = "https://invisibleexit.com/og-image.png";
const DATA_ATTR = "data-seo-head";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(DATA_ATTR, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  el.setAttribute(DATA_ATTR, "true");
}

function removeSeoTags() {
  document
    .querySelectorAll(`[${DATA_ATTR}]`)
    .forEach((el) => el.remove());
}

export default function SEOHead({
  title,
  description,
  url,
  image = DEFAULT_IMAGE,
  type = "website",
  publishedDate,
  modifiedDate,
  noindex = false,
  jsonLd,
}: SEOHeadProps) {
  const fullUrl = url.startsWith("http")
    ? url
    : `https://invisibleexit.com${url}`;

  const jsonLdScripts = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  useEffect(() => {
    // Clean previous SEO tags
    removeSeoTags();

    // Title
    document.title = title;

    // Meta description
    setMeta("name", "description", description);

    // Robots
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);
    canonical.setAttribute(DATA_ATTR, "true");

    // Open Graph
    setMeta("property", "og:type", type);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", fullUrl);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Article-specific
    if (type === "article" && publishedDate) {
      setMeta("property", "article:published_time", publishedDate);
    }
    if (type === "article" && modifiedDate) {
      setMeta("property", "article:modified_time", modifiedDate);
    }

    // JSON-LD
    jsonLdScripts.forEach((ld) => {
      const script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute(DATA_ATTR, "true");
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    });

    return () => {
      removeSeoTags();
    };
  }, [title, description, fullUrl, image, type, publishedDate, modifiedDate, noindex, jsonLdScripts]);

  return null;
}
