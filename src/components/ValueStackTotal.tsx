import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

/**
 * DOTCOM SECRETS Ch 18: Visual Value Stack with Running Total
 *
 * Russell's pattern: as each item is revealed, the running total climbs.
 * This creates the "anchor > price" perception that drives conversions.
 *
 * Usage:
 * <ValueStackTotal
 *   items={[{ name: "...", value: "$97" }, ...]}
 *   bonuses={[{ title: "...", value: "$47" }, ...]}
 *   finalPrice="$7"
 * />
 */

interface ValueStackItem {
  name: string;
  value: string;
}

interface ValueStackProps {
  items: ValueStackItem[];
  bonuses?: ValueStackItem[];
  finalPrice: string;
  priceLabel?: string;
  className?: string;
}

export default function ValueStackTotal({
  items,
  bonuses = [],
  finalPrice,
  priceLabel = "Your Price Today",
  className = "",
}: ValueStackProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const allItems = [...items, ...bonuses];
  const totalItems = allItems.length;

  // Parse dollar values for running total
  const parseValue = (val: string): number => {
    const match = val.match(/\$?([\d,]+)/);
    if (!match) return 0;
    return parseInt(match[1].replace(/,/g, ""));
  };

  const runningTotal = allItems
    .slice(0, visibleCount)
    .reduce((sum, item) => sum + parseValue(item.value), 0);

  // Animate items in on scroll into view
  useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Reveal items one by one
          allItems.forEach((_, i) => {
            setTimeout(() => setVisibleCount(i + 1), i * 250);
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnimated]);

  return (
    <div ref={containerRef} className={`max-w-lg mx-auto ${className}`}>
      {/* Stack Items */}
      <div className="space-y-2.5 mb-6">
        {items.map((item, i) => {
          const isVisible = i < visibleCount;
          const isBonus = false;
          return (
            <div
              key={`item-${i}`}
              className={`flex items-center justify-between gap-3 rounded-lg p-3.5 border transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0 bg-white/[0.04] border-white/10"
                  : "opacity-0 translate-y-4 bg-transparent border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Check className={`w-4 h-4 shrink-0 transition-colors ${isVisible ? "text-success" : "text-transparent"}`} />
                <span className="text-white/80 text-sm truncate">{item.name}</span>
              </div>
              <span className="text-white/40 text-xs font-mono shrink-0">{item.value}</span>
            </div>
          );
        })}

        {bonuses.map((bonus, i) => {
          const isVisible = items.length + i < visibleCount;
          return (
            <div
              key={`bonus-${i}`}
              className={`flex items-center justify-between gap-3 rounded-lg p-3.5 border transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0 bg-primary/[0.06] border-primary/15"
                  : "opacity-0 translate-y-4 bg-transparent border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-primary text-sm shrink-0">🎁</span>
                <span className="text-white/80 text-sm truncate font-medium">{bonus.name}</span>
              </div>
              <span className="text-white/40 text-xs font-mono shrink-0">{bonus.value}</span>
            </div>
          );
        })}
      </div>

      {/* Running Total — climbs as items appear */}
      <div className="border-t-2 border-white/10 pt-4 space-y-2">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            visibleCount >= totalItems ? "opacity-100" : "opacity-50"
          }`}
        >
          <span className="text-white/50 text-sm">Total Value:</span>
          <span className="text-white/50 line-through text-sm tabular-nums">
            ${runningTotal.toLocaleString()}
          </span>
        </div>

        {/* Final Price Reveal — only when all items visible */}
        <div
          className={`flex items-center justify-between pt-2 transition-all duration-500 ${
            visibleCount >= totalItems ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-white font-semibold text-lg">{priceLabel}:</span>
          <span className="text-4xl sm:text-5xl font-bold text-primary-light tabular-nums">
            {finalPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
