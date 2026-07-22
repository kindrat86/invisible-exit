import { Star, Quote, TrendingUp } from "lucide-react";

/**
 * Testimonial Grid Component
 *
 * Renders testimonials when provided. Without verified testimonials,
 * this component renders nothing — social proof must be earned.
 */

export interface Testimonial {
  type: "results" | "transformation" | "objection" | "detail";
  quote: string;
  name: string;
  role: string;
  result?: string;
  before?: string;
  after?: string;
  metric?: string;
  timeframe?: string;
  avatarColor?: string;
  initials?: string;
  stars?: number;
}

interface TestimonialGridProps {
  testimonials?: Testimonial[];
  className?: string;
  title?: string;
  subtitle?: string;
}

// No default testimonials — real proof must be earned, not written.
const DEFAULT_TESTIMONIALS: Testimonial[] = [];

export default function TestimonialGrid({
  testimonials = DEFAULT_TESTIMONIALS,
  className = "",
  title = "What Managers Are Saying",
  subtitle = "Real results from real corporate managers using the Invisible Exit system.",
}: TestimonialGridProps) {
  // If no testimonials provided, render nothing.
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-eyebrow text-primary mb-3">Social Proof</p>
        <h2 className="text-h1 text-foreground mb-4">{title}</h2>
        <p className="text-body text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} index={i} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const t = testimonial;

  return (
    <div
      className={`card-base p-6 card-hover animate-fade-up ${
        t.type === "results" ? "border-l-4 border-success/50" :
        t.type === "transformation" ? "border-l-4 border-primary/50" :
        t.type === "objection" ? "border-l-4 border-amber-400/50" :
        "border-l-4 border-blue-400/50"
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Stars */}
      {t.stars && (
        <div className="flex gap-1 mb-3">
          {[...Array(t.stars)].map((_, s) => (
            <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
      )}

      {/* Type badge */}
      <div className="mb-3">
        {t.type === "results" && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" /> RESULT
          </span>
        )}
        {t.type === "transformation" && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
            TRANSFORMATION
          </span>
        )}
        {t.type === "objection" && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            OBJECTION CRUSHED
          </span>
        )}
        {t.type === "detail" && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            SPECIFIC DETAIL
          </span>
        )}
      </div>

      {/* Quote */}
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary/15" />
        <p className="text-sm text-muted-foreground italic leading-relaxed pl-4">
          "{t.quote}"
        </p>
      </div>

      {/* Before/After (transformation type) */}
      {t.type === "transformation" && t.before && t.after && (
        <div className="mb-4 space-y-1.5">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-red-500 font-bold shrink-0">BEFORE:</span>
            <span className="text-muted-foreground">{t.before}</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-success font-bold shrink-0">AFTER:</span>
            <span className="text-foreground">{t.after}</span>
          </div>
        </div>
      )}

      {/* Metric (detail type) */}
      {t.type === "detail" && t.metric && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{t.metric}</p>
          {t.timeframe && <p className="text-xs text-blue-500 mt-1">{t.timeframe}</p>}
        </div>
      )}

      {/* Result (results type) */}
      {t.type === "results" && t.result && (
        <div className="mb-4">
          <p className="text-2xl font-bold text-success">{t.result}</p>
          {t.timeframe && <p className="text-xs text-muted-foreground mt-1">in {t.timeframe}</p>}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${t.avatarColor || "bg-primary/15 text-primary"}`}>
          {t.initials || t.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
          <p className="text-xs text-muted-foreground truncate">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
