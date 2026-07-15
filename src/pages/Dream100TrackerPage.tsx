import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Users,
  Mail,
  Search,
  TrendingUp,
  ArrowRight,
  Check,
  Clock,
  Star,
  Download,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { trackEvent } from "@/lib/analytics";

/**
 * TRAFFIC SECRETS: Secret #2 — Dream 100 Interactive Tracker
 *
 * This is a FUNCTIONAL tool (not just a static display page).
 * Uses localStorage to persist outreach progress across sessions.
 *
 * Russell's rules built in:
 *   - 5x follow-up rule (track touch count per target)
 *   - Weekly cadence (2 new contacts/week)
 *   - Stage tracking: Not started → Researching → First touch → In conversation → Partnered
 *   - Tiered priority system
 */

import { DREAM_100_TARGETS as TARGETS } from "@/data/dream100";
import type { DreamTarget } from "@/data/dream100";

type Stage = "Not started" | "Researching" | "First touch sent" | "In conversation" | "Partnered";

const STAGE_ORDER: Stage[] = ["Not started", "Researching", "First touch sent", "In conversation", "Partnered"];

const STAGE_COLORS: Record<Stage, string> = {
  "Not started": "text-slate-400 bg-slate-500/10",
  Researching: "text-blue-400 bg-blue-500/10",
  "First touch sent": "text-amber-400 bg-amber-500/10",
  "In conversation": "text-purple-400 bg-purple-500/10",
  Partnered: "text-emerald-400 bg-emerald-500/10",
};

const WEEKLY_OUTREACH_CADENCE = [
  { day: "Monday", task: "Research 2 targets: consume 3 pieces of their content, note angle", time: "30 min" },
  { day: "Tuesday", task: "Send 2 personalized first-touch emails (no pitch)", time: "30 min" },
  { day: "Wednesday", task: "Follow up on previous week's outreach (5x rule)", time: "20 min" },
  { day: "Thursday", task: "Send 2 more first-touch emails", time: "30 min" },
  { day: "Friday", task: "Update tracker, note responses, plan next week", time: "15 min" },
];

const STORAGE_KEY = "ie_dream100_tracker";

const Dream100TrackerPage = () => {
  const [stages, setStages] = useState<Record<string, Stage>>({});
  const [touches, setTouches] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<"all" | "Tier 1" | "Tier 2" | "Tier 3">("all");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setStages(data.stages || {});
        setTouches(data.touches || {});
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save to localStorage
  const saveProgress = (newStages: Record<string, Stage>, newTouches: Record<string, number>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stages: newStages, touches: newTouches }));
  };

  const updateStage = (name: string, newStage: Stage) => {
    const updated = { ...stages, [name]: newStage };
    setStages(updated);
    saveProgress(updated, touches);
    trackEvent("dream100_stage_update", { target: name, stage: newStage });
  };

  const incrementTouch = (name: string) => {
    const current = touches[name] || 0;
    const updated = { ...touches, [name]: current + 1 };
    setTouches(updated);
    saveProgress(stages, updated);
    trackEvent("dream100_touch_increment", { target: name, touches: current + 1 });
  };

  const resetAll = () => {
    if (confirm("Reset all Dream 100 tracking data? This cannot be undone.")) {
      setStages({});
      setTouches({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportData = () => {
    const data = TARGETS.map((t) => ({
      name: t.name,
      platform: t.platform,
      audience: t.audience,
      tier: t.tier,
      priority: t.priority,
      angle: t.angle,
      stage: stages[t.name] || "Not started",
      touches: touches[t.name] || 0,
    }));
    const csv = [
      "Name,Platform,Audience,Tier,Priority,Stage,Touches",
      ...data.map((d) => `"${d.name}","${d.platform}","${d.audience}","${d.tier}","${d.priority}","${d.stage}","${d.touches}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dream100-tracker.csv";
    a.click();
  };

  // Stats
  const stats = STAGE_ORDER.map((stage) => ({
    stage,
    count: TARGETS.filter((t) => (stages[t.name] || "Not started") === stage).length,
  }));

  const filteredTargets = filter === "all" ? TARGETS : TARGETS.filter((t) => t.tier === filter);

  const tierColor = (tier: string) =>
    tier === "Tier 1" ? "bg-primary/10 text-primary" :
    tier === "Tier 2" ? "bg-blue-500/10 text-blue-500" :
    "bg-purple-500/10 text-purple-500";

  const priorityColor = (priority: string) =>
    priority === "P0" ? "bg-red-500/10 text-red-400 border-red-500/20" :
    priority === "P1" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
    "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Dream 100 Tracker — Interactive Outreach Tool | Invisible Exit"
        description="Track your Dream 100 outreach progress. Manage stages, touch counts, and follow-ups. The Russell Brunson Dream 100 strategy, built as a functional tool."
        url="/dream-100-tracker"
      />
      <Navbar />

      {/* Hero */}
      <section className="hero-dark-radial pt-28 pb-12 sm:pt-32 sm:pb-16 section">
        <div className="container-narrow text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary-light text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4" />
            Interactive Outreach Tool
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
            Dream 100 Tracker
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            100 targets identified. This tool tracks your outreach stage, touch
            count, and follow-ups. Progress saves automatically in your browser.
          </p>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="section py-8">
        <div className="container-narrow">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {stats.map((s) => (
              <div
                key={s.stage}
                className={`rounded-xl border border-white/10 p-4 text-center ${STAGE_COLORS[s.stage]}`}
              >
                <p className="text-3xl font-bold">{s.count}</p>
                <p className="text-xs uppercase tracking-wide mt-1 opacity-70">{s.stage}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex gap-2">
              {(["all", "Tier 1", "Tier 2", "Tier 3"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {f === "all" ? "All Tiers" : f}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors"
              >
                <Download className="w-3 h-3" /> Export CSV
              </button>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tracker Table */}
      <section className="section pb-16">
        <div className="container-narrow">
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_0.8fr_0.6fr_1.2fr_0.8fr] gap-3 px-4 py-3 bg-white/5 border-b border-white/10 text-xs uppercase tracking-wide text-white/40 font-semibold">
              <span>Target</span>
              <span>Platform</span>
              <span>Audience</span>
              <span>Tier</span>
              <span>Stage</span>
              <span>Touches</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {filteredTargets.map((target) => {
                const stage = stages[target.name] || "Not started";
                const touchCount = touches[target.name] || 0;
                return (
                  <div
                    key={target.name}
                    className="px-4 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="md:grid md:grid-cols-[2fr_1fr_0.8fr_0.6fr_1.2fr_0.8fr] md:gap-3 md:items-center">
                      {/* Name + angle */}
                      <div className="mb-2 md:mb-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium text-sm">{target.name}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${priorityColor(target.priority)}`}>
                            {target.priority}
                          </span>
                        </div>
                        <p className="text-white/30 text-xs mt-1 line-clamp-2">{target.angle}</p>
                      </div>

                      {/* Platform */}
                      <div className="text-white/50 text-xs mb-1 md:mb-0">{target.platform}</div>

                      {/* Audience */}
                      <div className="text-white/50 text-xs mb-1 md:mb-0">{target.audience}</div>

                      {/* Tier */}
                      <div className="mb-1 md:mb-0">
                        <span className={`text-[10px] px-2 py-1 rounded font-medium ${tierColor(target.tier)}`}>
                          {target.tier}
                        </span>
                      </div>

                      {/* Stage selector */}
                      <div className="mb-1 md:mb-0">
                        <select
                          value={stage}
                          onChange={(e) => updateStage(target.name, e.target.value as Stage)}
                          className={`text-xs px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer font-medium ${STAGE_COLORS[stage]}`}
                        >
                          {STAGE_ORDER.map((s) => (
                            <option key={s} value={s} className="bg-slate-900 text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Touch counter */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => incrementTouch(target.name)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          <span className="font-semibold">{touchCount}</span>
                          <span className="text-white/30">/5</span>
                        </button>
                        {touchCount >= 5 && (
                          <Check className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5x Rule Reminder */}
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-amber-400/80 text-sm flex items-center gap-2">
              <Star className="w-4 h-4 flex-shrink-0" />
              <strong>Russell's 5x Rule:</strong> Most partnerships close on touch #3-5. If you haven't heard back, you haven't followed up enough times. Each touch should add new value: a new data point, testimonial, or content piece. Never guilt-trip.
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Cadence */}
      <section className="section py-16 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Your Weekly Outreach Cadence
          </h2>
          <div className="grid md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {WEEKLY_OUTREACH_CADENCE.map((day, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-xs">{idx + 1}</span>
                  </div>
                  <span className="text-white/70 font-semibold text-sm">{day.day}</span>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{day.task}</p>
                <p className="text-white/30 text-xs mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {day.time}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              Total: ~2 hours/week. At this pace, you'll contact all 100 targets in 25 weeks.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dream100TrackerPage;
