import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
}

/**
 * Wrapper component that applies scroll-reveal animation.
 * Uses the global ScrollReveal IntersectionObserver to trigger
 * the CSS reveal animation when the element enters the viewport.
 *
 * Usage: <Reveal delay={1}>...</Reveal>
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : "";
  return (
    <div className={`reveal${delayClass} ${className}`}>
      {children}
    </div>
  );
}

export default Reveal;
