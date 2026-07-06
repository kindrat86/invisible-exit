import { useEffect } from "react";
import { getHreflangAlternates } from "@/i18n/languages";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  noindex?: boolean;
}

const SITE_NAME = "Invisible Exit";
const DEFAULT_IMAGE = "https://invisibleexit.com/og-image.png";

function setMeta(attr: string, key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setLinkWithHreflang(rel: string, hreflang: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"][hreflang="${hreflang}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
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
}: SEOHeadProps) {
  const fullUrl = url
    ? (url.startsWith("http") ? url : `https://invisibleexit.com${url}`)
    : typeof window !== "undefined" ? window.location.href : "https://invisibleexit.com";

  useEffect(() => {
    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setLink("canonical", fullUrl);

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

    // ── hreflang alternate tags for all 97 languages (SEO) ──
    // Extract the path without any existing language prefix
    const pathFromUrl = url || (typeof window !== "undefined" ? window.location.pathname : "/");
    const cleanPath = pathFromUrl.replace(/^\/(en|af|sq|am|ar|hy|az|bal|eu|be|bn|bs|br|bg|my|ca|ceb|yue|cs|da|nl|et|fa|fi|fr|gl|ka|de|el|gu|cy|ha|he|hi|hmn|hu|is|ig|ilo|id|ga|it|ja|jv|kn|kk|km|ko|ku|lo|lv|lt|lb|mk|ms|ml|mt|mr|mad|mn|ne|no|or|ps|pa|pl|pt|ro|ru|gd|sr|si|sk|sl|so|es|su|sw|sv|tg|ta|te|th|bo|tl|tk|tr|ug|uk|ur|uz|vi|xh|yo|zh|zu)(\/|$)/, "/");

    const alternates = getHreflangAlternates(cleanPath);
    for (const alt of alternates) {
      setLinkWithHreflang("alternate", alt.hreflang, alt.href);
    }
  }, [title, description, fullUrl, image, type, publishedDate, modifiedDate, noindex, url]);

  return null;
}
