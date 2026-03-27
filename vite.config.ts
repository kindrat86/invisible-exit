import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import prerender from "@prerenderer/rollup-plugin";

const prerenderRoutes = [
  "/",
  "/blog",
  "/blog/how-much-money-to-never-work-again",
  "/blog/why-managing-directors-building-micro-saas",
  "/blog/invisible-business-model",
  "/blog/zero-to-4000-invisible-exit-timeline",
  "/blog/ai-tools-replace-startup-team",
  "/blog/real-estate-vs-micro-saas-freedom-math",
  "/privacy",
  "/terms",
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    prerender({
      routes: prerenderRoutes,
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        renderAfterTime: 5000,
      },
      postProcess(renderedRoute) {
        // Fix localhost URLs
        renderedRoute.html = renderedRoute.html.replace(
          /(https?:\/\/)?(localhost|127\.0\.0\.1):\d*/gi,
          "https://invisibleexit.com",
        );

        // Extract the title from the rendered <h1> for blog posts and
        // inject correct meta tags since react-helmet-async's client-side
        // DOM mutations aren't fully captured by puppeteer's page.content()
        const route = renderedRoute.route;
        const html = renderedRoute.html;

        // Extract page title from <title> tag set by Helmet (if captured) or from H1
        const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const pageTitle = h1Match ? h1Match[1] : null;

        // Extract description from the first <p> after the article starts
        const excerptMatch = html.match(/<article[^>]*>\s*<p[^>]*>([^<]{50,200})/);
        const excerpt = excerptMatch ? excerptMatch[1].trim() : null;

        if (route.startsWith("/blog/") && route !== "/blog" && pageTitle) {
          const fullTitle = `${pageTitle} | Invisible Exit Blog`;
          const desc = excerpt || pageTitle;
          const url = `https://invisibleexit.com${route}`;

          // Replace default meta tags with page-specific ones
          renderedRoute.html = renderedRoute.html
            .replace(/<title[^>]*>[^<]*<\/title>/, `<title>${fullTitle}</title>`)
            .replace(/(<meta[^>]*name="description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/,  `$1${fullTitle}$2`)
            .replace(/(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/,  `$1${url}$2`)
            .replace(/(<meta[^>]*property="og:type"[^>]*content=")[^"]*(")/,  `$1article$2`)
            .replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/,  `$1${fullTitle}$2`)
            .replace(/(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/,  `$1${url}$2`);
        } else if (route === "/blog") {
          const title = "Blog: Invisible Exit Strategies for Corporate Managers | Invisible Exit";
          const desc = "Articles on building invisible recurring revenue, micro-SaaS businesses, and financial independence for corporate managers and executives.";
          const url = "https://invisibleexit.com/blog";
          renderedRoute.html = renderedRoute.html
            .replace(/<title[^>]*>[^<]*<\/title>/, `<title>${title}</title>`)
            .replace(/(<meta[^>]*name="description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/,  `$1${url}$2`)
            .replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/,  `$1${desc}$2`)
            .replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/,  `$1${url}$2`);
        } else if (route === "/privacy") {
          const title = "Privacy Policy | Invisible Exit";
          const url = "https://invisibleexit.com/privacy";
          renderedRoute.html = renderedRoute.html
            .replace(/<title[^>]*>[^<]*<\/title>/, `<title>${title}</title>`)
            .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/,  `$1${url}$2`)
            .replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/,  `$1${url}$2`);
        } else if (route === "/terms") {
          const title = "Terms of Service | Invisible Exit";
          const url = "https://invisibleexit.com/terms";
          renderedRoute.html = renderedRoute.html
            .replace(/<title[^>]*>[^<]*<\/title>/, `<title>${title}</title>`)
            .replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/,  `$1${url}$2`)
            .replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/,  `$1${title}$2`)
            .replace(/(<link[^>]*rel="canonical"[^>]*href=")[^"]*(")/,  `$1${url}$2`);
        }

        // Inject JSON-LD from the rendered page body if Helmet added script tags
        // The prerenderer should capture <script type="application/ld+json"> tags
        // that Helmet injected into <head>, but if not, the body content is still
        // fully indexed by crawlers.
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
