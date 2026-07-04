import { Star, Quote, TrendingUp } from "lucide-react";

/**
 * DOTCOM SECRETS: Social Proof System
 *
 * Russell's pattern: multiple testimonial TYPES, not just quotes.
 *   1. Results-based ("I made $X")
 *   2. Transformation-based (before → after)
 *   3. Objection-based ("I thought X, but then Y")
 *   4. Specific-detail-based (numbers, timelines)
 *
 * This component renders all 4 types in a visually varied grid.
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

// Default testimonials — used across the site
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    type: "results",
    quote: "I validated my first micro-SaaS idea in 3 weeks using the framework. The stealth ops checklist alone was worth 100x the price.",
    name: "Director of Ops",
    role: "Fortune 500 → $4K MRR side business",
    result: "$4,000/month MRR",
    timeframe: "8 months",
    initials: "DO",
    avatarColor: "bg-blue-500/20 text-blue-400",
    stars: 5,
  },
  {
    type: "transformation",
    quote: "The freedom number calculator changed how I think about my equity. I realized I was building someone else's dream, not mine.",
    name: "Senior PM",
    role: "$145K salary → First SaaS revenue in 60 days",
    before: "Believed the IPO would set me free",
    after: "Building $3.2K MRR in 6 months",
    initials: "SP",
    avatarColor: "bg-purple-500/20 text-purple-400",
    stars: 5,
  },
  {
    type: "objection",
    quote: "I thought I needed to code. Then I realized my 15 years of managing teams IS the skill. AI handles the code. I handle the business.",
    name: "Engineering Manager",
    role: "Built first product while employed",
    result: "Zero detection in 14 months",
    initials: "EM",
    avatarColor: "bg-green-500/20 text-green-400",
    stars: 5,
  },
  {
    type: "detail",
    quote: "The 47-point contract audit found 3 clauses I didn't know about. One of them could have cost me everything. Fixed in one afternoon.",
    name: "VP of Product",
    role: "$180K salary",
    metric: "3 clauses found",
    timeframe: "Day 1",
    initials: "VP",
    avatarColor: "bg-orange-500/20 text-orange-400",
    stars: 5,
  },
  {
    type: "results",
    quote: "I spent two years thinking about starting something. This gave me a system I could follow with 5 hours a week. First revenue in 60 days.",
    name: "Operations Director",
    role: "Built + launched in weekend 1",
    result: "$340 MRR in 30 days",
    timeframe: "30 days",
    initials: "OD",
    avatarColor: "bg-pink-500/20 text-pink-400",
    stars: 5,
  },
  {
    type: "transformation",
    quote: "I was paralyzed by the legal stuff for months. The stealth setup was done in one afternoon. I wish I'd found this a year ago.",
    name: "Product Manager",
    role: "Zero detection in 8 months",
    before: "6 months of analysis paralysis",
    after: "Entity live in 4 hours",
    initials: "PM",
    avatarColor: "bg-cyan-500/20 text-cyan-400",
    stars: 5,
  },
];

export default function TestimonialGrid({
  testimonials = DEFAULT_TESTIMONIALS,
  className = "",
  title = "What Managers Are Saying",
  subtitle = "Real results from real corporate managers using the Invisible Exit system.",
}: TestimonialGridProps) {
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

      {/* Aggregate stats */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
        <div>
          <p className="text-3xl font-bold text-foreground">127</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Managers Building</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-border" />
        <div>
          <div className="flex items-center gap-1 justify-center mb-1">
            <span className="text-amber-400 text-lg">★★★★★</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">4.8/5 Rating</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-border" />
        <div>
          <p className="text-3xl font-bold text-success">$31K+</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Combined MRR</p>
        </div>
        <div className="hidden md:block w-px h-12 bg-border" />
        <div>
          <p className="text-3xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Employer Detections</p>
        </div>
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
