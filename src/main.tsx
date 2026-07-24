import { createRoot } from "react-dom/client";
import './integrations/posthog';
import App from "./App.tsx";
import "./index.css";

// A deploy replaces hashed chunk files; a returning visitor's cached shell may
// request chunks that no longer exist. Reload once to pick up the new build.
window.addEventListener("vite:preloadError", (e) => {
  e.preventDefault();
  try {
    if (!sessionStorage.getItem("chunk-reload")) {
      sessionStorage.setItem("chunk-reload", "1");
      window.location.reload();
    }
    // Flag already set: this session already reloaded once — swallow the
    // error instead of reload-looping.
  } catch {
    /* storage blocked — do not reload blindly (would risk a loop) */
  }
});
// Consider the load healthy after 15s and re-arm the one-shot reload guard.
setTimeout(() => {
  try {
    sessionStorage.removeItem("chunk-reload");
  } catch { /* storage blocked */ }
}, 15000);

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
