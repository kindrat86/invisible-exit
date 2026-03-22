import type { ActionPlanTask } from "@/types/fym";

export const ACTION_PLAN_PHASES = [
  { key: "hour_0_8" as const, label: "Hours 0-8: Market Validation" },
  { key: "hour_8_24" as const, label: "Hours 8-24: Offer Design" },
  { key: "hour_24_40" as const, label: "Hours 24-40: Build MVP" },
  { key: "hour_40_48" as const, label: "Hours 40-48: First Customers" },
];

export const ACTION_PLAN_TASKS: ActionPlanTask[] = [
  // Phase 1: Hours 0-8 — Market Validation
  {
    id: "ap_1",
    phase: "hour_0_8",
    phaseLabel: "Hours 0-8: Market Validation",
    text: "Find 3 online communities where your target customer hangs out",
    category: "market",
  },
  {
    id: "ap_2",
    phase: "hour_0_8",
    phaseLabel: "Hours 0-8: Market Validation",
    text: "Post a question or poll asking about the specific pain point",
    category: "market",
  },
  {
    id: "ap_3",
    phase: "hour_0_8",
    phaseLabel: "Hours 0-8: Market Validation",
    text: "DM 10 people who complained about the problem — ask what they tried",
    category: "market",
  },
  {
    id: "ap_4",
    phase: "hour_0_8",
    phaseLabel: "Hours 0-8: Market Validation",
    text: "Search for existing solutions and note their pricing, reviews, and gaps",
    category: "moat",
  },

  // Phase 2: Hours 8-24 — Offer Design
  {
    id: "ap_5",
    phase: "hour_8_24",
    phaseLabel: "Hours 8-24: Offer Design",
    text: "Write a one-paragraph product description (what it does, who it's for, what it costs)",
    category: "revenue",
  },
  {
    id: "ap_6",
    phase: "hour_8_24",
    phaseLabel: "Hours 8-24: Offer Design",
    text: "Create a simple landing page (Carrd, Framer, or a single HTML page)",
    category: "build",
  },
  {
    id: "ap_7",
    phase: "hour_8_24",
    phaseLabel: "Hours 8-24: Offer Design",
    text: "Add an email signup or 'Notify Me' form to gauge interest",
    category: "market",
  },
  {
    id: "ap_8",
    phase: "hour_8_24",
    phaseLabel: "Hours 8-24: Offer Design",
    text: "Set up payment (Stripe/LemonSqueezy) under your LLC — test checkout flow",
    category: "revenue",
  },

  // Phase 3: Hours 24-40 — Build MVP
  {
    id: "ap_9",
    phase: "hour_24_40",
    phaseLabel: "Hours 24-40: Build MVP",
    text: "Build the single core feature that solves the #1 pain point",
    category: "build",
  },
  {
    id: "ap_10",
    phase: "hour_24_40",
    phaseLabel: "Hours 24-40: Build MVP",
    text: "Deploy to a live URL (Vercel/Netlify) and verify it works end-to-end",
    category: "build",
  },
  {
    id: "ap_11",
    phase: "hour_24_40",
    phaseLabel: "Hours 24-40: Build MVP",
    text: "Ensure all accounts (domain, hosting, tools) are under your LLC name",
    category: "invisibility",
  },
  {
    id: "ap_12",
    phase: "hour_24_40",
    phaseLabel: "Hours 24-40: Build MVP",
    text: "Write a 3-sentence support/FAQ page (reduce support burden from day one)",
    category: "build",
  },

  // Phase 4: Hours 40-48 — First Customers
  {
    id: "ap_13",
    phase: "hour_40_48",
    phaseLabel: "Hours 40-48: First Customers",
    text: "Share the landing page in the 3 communities you identified",
    category: "market",
  },
  {
    id: "ap_14",
    phase: "hour_40_48",
    phaseLabel: "Hours 40-48: First Customers",
    text: "DM 5 people who expressed interest — offer early access or discount",
    category: "revenue",
  },
  {
    id: "ap_15",
    phase: "hour_40_48",
    phaseLabel: "Hours 40-48: First Customers",
    text: "Track signups, clicks, and any payments — record your conversion metrics",
    category: "revenue",
  },
  {
    id: "ap_16",
    phase: "hour_40_48",
    phaseLabel: "Hours 40-48: First Customers",
    text: "Make a GO/KILL decision: if zero interest after 48 hours, move to next idea",
    category: "market",
  },
];
