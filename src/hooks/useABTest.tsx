import {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import * as React from "react";

/**
 * DOTCOM SECRETS: Chapter 3b — Testing (A/B Split Tests)
 *
 * Russell Brunson: "The one who tests the most, wins."
 *
 * Lightweight A/B testing framework:
 *   - Assigns a variant on first visit (50/50 by default)
 *   - Persists assignment in localStorage (consistent experience)
 *   - Tracks exposure via PostHog (if available) or analytics
 *   - No external service required — works on static/SPA builds
 *
 * Usage:
 *   const variant = useABTest("hero_headline", ["control", "benefit"], [50, 50]);
 *   return <h1>{variant === "control" ? "Headline A" : "Headline B"}</h1>
 *
 * Or with the component:
 *   <ABTest experiment="hero_headline">
 *     <ABVariant name="A">Original headline</ABVariant>
 *     <ABVariant name="B">New headline</ABVariant>
 *   </ABTest>
 */

const STORAGE_PREFIX = "ab_test_";

interface ABTestConfig {
  experiment: string;
  variants: string[];
  weights?: number[];
}

/**
 * Deterministic variant assignment based on experiment name + random seed.
 * Stores assignment in localStorage for consistency across sessions.
 */
export function getVariant(experiment: string, variants: string[], weights?: number[]): string {
  const key = STORAGE_PREFIX + experiment;

  // Check existing assignment
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(key);
    if (existing && variants.includes(existing)) {
      return existing;
    }

    // Assign new variant
    const w = weights || variants.map(() => 100 / variants.length);
    const total = w.reduce((a, b) => a + b, 0);
    const r = Math.random() * total;
    let cumulative = 0;
    let assigned = variants[0];

    for (let i = 0; i < variants.length; i++) {
      cumulative += w[i];
      if (r <= cumulative) {
        assigned = variants[i];
        break;
      }
    }

    localStorage.setItem(key, assigned);

    // Track exposure
    try {
      const track = (window as any).posthog;
      if (track?.capture) {
        track.capture("ab_test_exposed", {
          experiment,
          variant: assigned,
        });
      }
    } catch {
      // PostHog not loaded — silent
    }

    return assigned;
  }

  return variants[0];
}

/**
 * Hook: useABTest
 * Returns the assigned variant for the current user.
 */
export function useABTest(
  experiment: string,
  variants: string[],
  weights?: number[]
): string {
  const [variant, setVariant] = useState<string>(variants[0]);

  useEffect(() => {
    setVariant(getVariant(experiment, variants, weights));
  }, [experiment]);

  return variant;
}

/**
 * Hook: useABTestConversion
 * Call this when a conversion event happens (e.g., email submit, purchase).
 * Tracks which variant led to the conversion.
 */
export function trackABConversion(experiment: string, eventName: string, props?: Record<string, any>) {
  if (typeof window === "undefined") return;

  const key = STORAGE_PREFIX + experiment;
  const variant = localStorage.getItem(key);

  try {
    const track = (window as any).posthog;
    if (track?.capture) {
      track.capture(eventName, {
        ...props,
        ab_experiment: experiment,
        ab_variant: variant,
      });
    }
  } catch {
    // Silent
  }
}

// ── React Component API ──

interface ABTestProps {
  experiment: string;
  weights?: number[];
  children: React.ReactNode;
}

interface ABVariantProps {
  name: string;
  children: React.ReactNode;
}

const ABTestContext = createContext<{ experiment: string; variant: string }>({
  experiment: "",
  variant: "",
});

export function ABTest({ experiment, weights, children }: ABTestProps) {
  const variantNames: string[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && (child.props as ABVariantProps).name) {
      variantNames.push((child.props as ABVariantProps).name);
    }
  });

  const assigned = useABTest(experiment, variantNames, weights);

  return React.createElement(
    ABTestContext.Provider,
    { value: { experiment, variant: assigned } },
    children
  );
}

export function ABVariant({ name, children }: ABVariantProps) {
  const ctx = useContext(ABTestContext);
  if (ctx.variant !== name) return null;
  return React.createElement(React.Fragment, null, children);
}
