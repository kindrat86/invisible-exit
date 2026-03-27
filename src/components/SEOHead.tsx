import { Helmet } from "react-helmet-async";

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
const DEFAULT_IMAGE = "https://invisibleexit.com/og-image.png"; // TODO: Create and upload an OG image (1200x630px)

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

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific */}
      {type === "article" && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {type === "article" && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}

      {/* JSON-LD Structured Data */}
      {jsonLdScripts.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
