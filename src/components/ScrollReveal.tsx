import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal animation using IntersectionObserver.
 * Add the `reveal` class to any element, and it will animate in
 * when scrolled into view. Use `reveal-delay-1` through `reveal-delay-4`
 * for staggered animations.
 *
 * This component wraps the app and observes all `.reveal` elements.
 * No props needed — just drop it in once.
 */
export function ScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Just reveal everything immediately
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.1,
      }
    );

    observerRef.current = observer;

    // Observe all reveal elements
    const revealElements = document.querySelectorAll(".reveal:not(.revealed)");
    revealElements.forEach((el) => observer.observe(el));

    // Re-scan for new elements periodically (for SPA route changes)
    const interval = setInterval(() => {
      const newElements = document.querySelectorAll(".reveal:not(.revealed):not([data-observed])");
      newElements.forEach((el) => {
        el.setAttribute("data-observed", "true");
        observer.observe(el);
      });
    }, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null;
}
