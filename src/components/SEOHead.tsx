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

    // ── hreflang alternate tags for all 100 languages (SEO) ──
    // Extract the path without any existing language prefix
    const pathFromUrl = url || (typeof window !== "undefined" ? window.location.pathname : "/");
    const cleanPath = pathFromUrl.replace(/^\/(en|zh|hi|es|fr|ar|bn|pt|ru|ur|id|de|ja|pcm|mr|te|tr|ta|vi|yue|pa|ko|fa|it|th|gu|kn|ml|or|pl|uk|nl|ro|el|cs|hu|sv|fi|no|da|he|sw|am|so|ha|yo|ig|zu|xh|af|ms|my|km|lo|ne|si|ps|kk|uz|az|ka|hy|mn|bo|ug|tl|ceb|ilo|jv|su|mad|nan|wuu|hak|hmn|ku|bal|tg|tk|sq|sr|hr|bs|sk|sl|lt|lv|et|be|bg|mk|ca|eu|gl|cy|ga|gd|br|is|lb|mt)(\/|$)/, "/");

    const alternates = getHreflangAlternates(cleanPath);
    for (const alt of alternates) {
      setLinkWithHreflang("alternate", alt.hreflang, alt.href);
    }
  }, [title, description, fullUrl, image, type, publishedDate, modifiedDate, noindex, url]);

  return null;
}
