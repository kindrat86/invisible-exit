import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — stable, cached long-term. clsx/tailwind-merge live here
          // so the entry's cn() helper doesn't drag the charts chunk onto every page.
          "vendor-react": ["react", "react-dom", "react-router-dom", "clsx", "tailwind-merge"],
          // Radix UI primitives — shared across many components
          "vendor-radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          // Icons — large set, rarely changes
          "vendor-icons": ["lucide-react"],
          // Data layer
          "vendor-data": ["@tanstack/react-query", "@supabase/supabase-js"],
          // Charting — only used in dashboard
          "vendor-charts": ["recharts", "date-fns"],
          // Capture — only used in specific tools
          "vendor-capture": ["html2canvas"],
        },
      },
    },
  },
});
