import { createRoot } from "react-dom/client";
import './integrations/posthog';
import "./i18n"; // Initialize i18next before app renders
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// ── Register Service Worker for PWA offline support + performance caching ──
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then(
      (registration) => {
        // SW registered successfully
        registration.update();
      },
      (err) => {
        // SW registration failed — non-critical, site still works
        console.debug("SW registration skipped:", err.message);
      },
    );
  });
}
