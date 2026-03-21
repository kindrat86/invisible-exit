import seedIdeas from "./idea-directory.json";
import type { IdeaEntry } from "@/types/fym";

// ── Template data for generating 1000 diverse ideas ──

const INDUSTRIES = [
  "Local Services",
  "E-commerce",
  "Technology",
  "Health & Fitness",
  "Education",
  "Real Estate",
  "Finance",
  "Food & Beverage",
  "Travel & Hospitality",
  "Automotive",
  "Legal",
  "Marketing",
  "HR & Recruiting",
  "Construction",
  "Pet Services",
  "Beauty & Wellness",
  "Agriculture",
  "Logistics",
  "Entertainment",
  "Non-Profit",
];

const REVENUE_TIERS = [
  "$0-500/mo",
  "$500-2K/mo",
  "$2K-5K/mo",
  "$5K-10K/mo",
  "$10K+/mo",
];

const TIME_INVESTMENTS = [
  "2-3 hrs/week",
  "5-7 hrs/week",
  "10-15 hrs/week",
  "15+ hrs/week",
];

const DIFFICULTIES = [
  "No-Code",
  "Low-Code",
  "Some Coding",
  "Developer Required",
];

const STARTUP_COSTS = ["$0-50", "$50-200", "$200-500", "$500+"];

const MONETIZATION_MODELS = [
  "SaaS Subscription",
  "Freemium",
  "Marketplace",
  "One-time",
  "Usage-Based",
  "Affiliate",
  "Lead Generation",
  "White-Label",
];

const TOOL_STACKS = [
  "Lovable + Stripe + Vercel",
  "Next.js + Supabase + Stripe",
  "Bubble + Zapier + Stripe",
  "WordPress + WooCommerce",
  "Shopify + Zapier",
  "React + Firebase + Stripe",
  "Webflow + Memberstack",
  "Carrd + Gumroad",
  "Airtable + Softr + Stripe",
  "Framer + Lemon Squeezy",
  "OpenAI API + Vercel + Stripe",
  "Claude API + Next.js + Supabase",
  "Make.com + Google Sheets + Stripe",
  "Retool + PostgreSQL",
  "Directus + Nuxt + Stripe",
  "Astro + Snipcart",
  "Ghost + Stripe",
  "Notion + Super.so + Gumroad",
  "Tally + Zapier + Airtable",
  "Typeform + Zapier + Mailchimp",
];

// ── Idea templates by industry ──
// Each template: [titlePattern, descriptionPattern, tags[]]
// {noun}, {adj}, {action} placeholders are filled per-industry

interface IdeaTemplate {
  title: string;
  description: string;
  tags: string[];
}

const TEMPLATES: Record<string, IdeaTemplate[]> = {
  "Local Services": [
    { title: "Automated Invoice System for {noun}", description: "Generates and sends professional invoices automatically for {noun} businesses. Tracks payments, sends reminders, and integrates with accounting software.", tags: ["B2B", "automation", "recurring", "local"] },
    { title: "{noun} Appointment Scheduler", description: "A self-service booking platform designed for {noun}. Customers pick time slots, get reminders, and can reschedule without calling.", tags: ["B2B", "scheduling", "local", "SaaS"] },
    { title: "Review Booster for {noun}", description: "Automatically sends review requests to {noun} customers after service completion. Includes templates and follow-up sequences to maximize 5-star reviews.", tags: ["B2B", "reviews", "automation", "local"] },
    { title: "{noun} Lead Generation Chatbot", description: "An AI chatbot that sits on {noun} websites, qualifies leads 24/7, and books consultations automatically.", tags: ["B2B", "AI", "lead-gen", "local"] },
    { title: "Fleet Tracking Dashboard for {noun}", description: "Simple GPS tracking and route optimization for {noun} with multiple vehicles. Shows real-time locations and generates daily reports.", tags: ["B2B", "tracking", "operations", "local"] },
    { title: "{noun} Customer Portal", description: "A white-label customer portal for {noun} where clients can view service history, upcoming appointments, and pay invoices.", tags: ["B2B", "portal", "recurring", "local"] },
    { title: "Seasonal Marketing Kit for {noun}", description: "Pre-built email and social media templates for {noun} seasonal promotions. Includes holiday campaigns, back-to-school specials, and weather-triggered offers.", tags: ["B2B", "marketing", "templates", "local"] },
    { title: "{noun} Estimate Calculator", description: "An embeddable widget that lets {noun} customers get instant price estimates online before booking. Reduces phone calls and qualifies leads.", tags: ["B2B", "calculator", "lead-gen", "local"] },
  ],
  "E-commerce": [
    { title: "Product Description AI for {noun}", description: "AI tool that rewrites bland {noun} product descriptions into conversion-optimized copy. Paste a URL, get 3 variations with SEO keywords.", tags: ["AI", "copywriting", "e-commerce", "SaaS"] },
    { title: "{noun} Inventory Alert System", description: "Monitors {noun} inventory levels across multiple platforms and sends alerts when stock is low. Prevents overselling and stockouts.", tags: ["e-commerce", "inventory", "automation", "B2B"] },
    { title: "Returns Management for {noun}", description: "Automates the {noun} returns process with self-service portals, shipping label generation, and restocking workflows.", tags: ["e-commerce", "operations", "automation", "SaaS"] },
    { title: "{noun} Price Comparison Tool", description: "Scrapes competitor prices for {noun} products and suggests optimal pricing. Updates daily with margin calculations.", tags: ["e-commerce", "pricing", "analytics", "B2B"] },
    { title: "UGC Collection Platform for {noun}", description: "Collects user-generated content like photos and reviews from {noun} customers. Auto-curates the best content for social media and product pages.", tags: ["e-commerce", "UGC", "social", "SaaS"] },
    { title: "{noun} Abandoned Cart Recovery", description: "Multi-channel abandoned cart recovery for {noun} stores. Sends personalized emails, SMS, and retargeting ads to bring customers back.", tags: ["e-commerce", "marketing", "automation", "SaaS"] },
    { title: "Shipping Rate Optimizer for {noun}", description: "Compares shipping rates across carriers for {noun} sellers. Finds the cheapest option for each package size and destination.", tags: ["e-commerce", "shipping", "cost-saving", "SaaS"] },
    { title: "{noun} Bundle Builder", description: "Lets {noun} customers create custom product bundles with dynamic pricing. Increases average order value through smart upselling.", tags: ["e-commerce", "upsell", "conversion", "SaaS"] },
  ],
  "Technology": [
    { title: "{noun} Uptime Monitor", description: "Monitors {noun} services and websites for downtime. Sends instant alerts via Slack, email, or SMS when issues are detected.", tags: ["SaaS", "monitoring", "DevOps", "recurring"] },
    { title: "API Usage Dashboard for {noun}", description: "Tracks API usage, costs, and performance for {noun} applications. Visual dashboards with alerts for rate limits and budget thresholds.", tags: ["SaaS", "analytics", "developer", "B2B"] },
    { title: "{noun} Documentation Generator", description: "Auto-generates API documentation and user guides from {noun} codebases. Keeps docs in sync with code changes.", tags: ["developer", "automation", "SaaS", "B2B"] },
    { title: "Bug Report Aggregator for {noun}", description: "Collects bug reports from multiple channels for {noun} teams and deduplicates them. Prioritizes by frequency and impact.", tags: ["developer", "QA", "SaaS", "B2B"] },
    { title: "{noun} Security Scanner", description: "Automated security vulnerability scanning for {noun} applications. Checks for common OWASP issues and generates fix recommendations.", tags: ["security", "SaaS", "developer", "B2B"] },
    { title: "Code Review Bot for {noun}", description: "AI-powered code review assistant for {noun} teams. Catches bugs, suggests improvements, and enforces coding standards automatically.", tags: ["AI", "developer", "automation", "SaaS"] },
    { title: "{noun} Performance Profiler", description: "Identifies performance bottlenecks in {noun} applications. Provides actionable recommendations with before/after benchmarks.", tags: ["developer", "performance", "SaaS", "B2B"] },
    { title: "Changelog Generator for {noun}", description: "Automatically generates beautiful changelogs from {noun} git commits. Categorizes changes and notifies users of updates.", tags: ["developer", "automation", "SaaS", "B2B"] },
  ],
  "Health & Fitness": [
    { title: "Meal Prep Planner for {noun}", description: "Generates weekly meal plans tailored for {noun} goals. Includes grocery lists, macros tracking, and prep-day schedules.", tags: ["health", "planning", "B2C", "SaaS"] },
    { title: "{noun} Habit Tracker", description: "A simple daily habit tracker designed for {noun} enthusiasts. Tracks streaks, sends reminders, and shows progress charts.", tags: ["health", "tracking", "B2C", "mobile"] },
    { title: "Client Progress Dashboard for {noun}", description: "Lets {noun} coaches track client progress with photos, measurements, and workout logs. Clients get their own portal.", tags: ["B2B", "coaching", "health", "SaaS"] },
    { title: "{noun} Class Booking System", description: "Online booking system for {noun} classes and sessions. Handles waitlists, cancellations, and package purchases.", tags: ["B2B", "scheduling", "health", "SaaS"] },
    { title: "Supplement Recommendation Engine for {noun}", description: "Quiz-based supplement recommender for {noun} goals. Generates personalized stacks based on health data and objectives.", tags: ["health", "AI", "e-commerce", "affiliate"] },
    { title: "{noun} Workout Generator", description: "AI-powered workout generator customized for {noun}. Creates progressive programs based on equipment, time, and fitness level.", tags: ["AI", "health", "B2C", "SaaS"] },
    { title: "Injury Prevention Guide for {noun}", description: "Interactive injury prevention and recovery guide for {noun} athletes. Includes video exercises, stretching routines, and recovery protocols.", tags: ["health", "content", "B2C", "subscription"] },
    { title: "{noun} Community Platform", description: "Private community platform for {noun} enthusiasts. Includes challenges, leaderboards, and progress sharing features.", tags: ["health", "community", "B2C", "SaaS"] },
  ],
  "Education": [
    { title: "Quiz Builder for {noun}", description: "Teachers create interactive quizzes for {noun} subjects. Auto-grades, provides analytics, and adapts difficulty based on student performance.", tags: ["education", "SaaS", "B2B", "AI"] },
    { title: "{noun} Flashcard Generator", description: "AI-powered flashcard creator for {noun} topics. Generates cards from textbook content and uses spaced repetition for optimal learning.", tags: ["education", "AI", "B2C", "SaaS"] },
    { title: "Parent-Teacher Communication for {noun}", description: "Messaging platform connecting {noun} teachers with parents. Includes updates, grade notifications, and scheduling for conferences.", tags: ["education", "communication", "B2B", "SaaS"] },
    { title: "{noun} Tutoring Marketplace", description: "Connects {noun} students with qualified tutors. Handles scheduling, payments, and session recordings.", tags: ["education", "marketplace", "B2C", "platform"] },
    { title: "Curriculum Planner for {noun}", description: "Helps {noun} educators plan and organize their curriculum. Aligns with standards, tracks pacing, and shares resources.", tags: ["education", "planning", "B2B", "SaaS"] },
    { title: "{noun} Study Group Matcher", description: "Matches {noun} students into study groups based on schedule, learning style, and subject needs.", tags: ["education", "matching", "B2C", "SaaS"] },
    { title: "Assignment Feedback Tool for {noun}", description: "AI-assisted feedback generator for {noun} assignments. Provides detailed comments, suggestions, and rubric-based grading.", tags: ["education", "AI", "B2B", "SaaS"] },
    { title: "{noun} Certificate Generator", description: "Creates professional certificates for {noun} course completions. Includes verification links and bulk generation for institutions.", tags: ["education", "automation", "B2B", "SaaS"] },
  ],
  "Real Estate": [
    { title: "Virtual Tour Creator for {noun}", description: "Lets {noun} agents create 360° virtual tours from smartphone photos. No expensive cameras needed — just upload and publish.", tags: ["real-estate", "content", "B2B", "SaaS"] },
    { title: "{noun} CRM Lite", description: "A lightweight CRM built specifically for {noun} professionals. Tracks leads, follow-ups, and deal stages without the bloat.", tags: ["real-estate", "CRM", "B2B", "SaaS"] },
    { title: "Rental Application Processor for {noun}", description: "Automates {noun} rental application screening. Background checks, credit reports, and tenant scoring in one dashboard.", tags: ["real-estate", "automation", "B2B", "SaaS"] },
    { title: "{noun} Market Report Generator", description: "Auto-generates beautiful {noun} market reports from MLS data. Agents share branded reports to position as local experts.", tags: ["real-estate", "marketing", "automation", "B2B"] },
    { title: "Property Maintenance Tracker for {noun}", description: "Tracks maintenance requests, vendor assignments, and repair history for {noun} properties. Tenants submit via portal.", tags: ["real-estate", "operations", "B2B", "SaaS"] },
    { title: "{noun} Open House Sign-In", description: "Digital sign-in for {noun} open houses. Captures leads, sends follow-up emails, and syncs with CRM automatically.", tags: ["real-estate", "lead-gen", "automation", "B2B"] },
    { title: "ROI Calculator for {noun}", description: "Investment property ROI calculator for {noun} investors. Factors in mortgage, taxes, maintenance, vacancy, and appreciation.", tags: ["real-estate", "calculator", "B2C", "lead-gen"] },
    { title: "{noun} Listing Description Writer", description: "AI-generated listing descriptions for {noun} properties. Input property details, get compelling copy optimized for search.", tags: ["real-estate", "AI", "copywriting", "B2B"] },
  ],
  "Finance": [
    { title: "Expense Categorizer for {noun}", description: "Automatically categorizes {noun} business expenses from bank feeds. Learns from corrections and exports to accounting software.", tags: ["finance", "AI", "automation", "B2B"] },
    { title: "{noun} Invoice Factoring Platform", description: "Connects {noun} businesses with invoice factoring providers. Get cash for outstanding invoices within 24 hours.", tags: ["finance", "marketplace", "B2B", "platform"] },
    { title: "Tax Deadline Tracker for {noun}", description: "Tracks all tax deadlines and filing requirements for {noun} businesses. Sends reminders with prep checklists.", tags: ["finance", "compliance", "B2B", "SaaS"] },
    { title: "{noun} Budget Forecaster", description: "AI-powered budget forecasting for {noun} businesses. Analyzes past spending patterns to predict future cash flow needs.", tags: ["finance", "AI", "analytics", "B2B"] },
    { title: "Subscription Audit Tool for {noun}", description: "Scans {noun} business accounts for unused subscriptions and recurring charges. Identifies savings opportunities.", tags: ["finance", "cost-saving", "SaaS", "B2B"] },
    { title: "{noun} Financial Dashboard", description: "Unified financial dashboard for {noun} that pulls data from multiple bank accounts, payment processors, and accounting tools.", tags: ["finance", "analytics", "dashboard", "B2B"] },
    { title: "Profit Margin Calculator for {noun}", description: "Real-time profit margin tracking for {noun} products and services. Alerts when margins drop below thresholds.", tags: ["finance", "analytics", "B2B", "SaaS"] },
    { title: "{noun} Grant Finder", description: "Matches {noun} businesses with available grants and funding opportunities. Filters by industry, size, and location.", tags: ["finance", "matching", "B2B", "SaaS"] },
  ],
  "Food & Beverage": [
    { title: "Menu Builder for {noun}", description: "Digital menu creator for {noun} with QR code integration. Update prices and items in real-time, no reprinting needed.", tags: ["F&B", "SaaS", "B2B", "local"] },
    { title: "{noun} Waste Tracker", description: "Tracks food waste for {noun} operations. Identifies patterns, suggests portion adjustments, and calculates cost savings.", tags: ["F&B", "analytics", "sustainability", "B2B"] },
    { title: "Supplier Comparison Tool for {noun}", description: "Compares supplier prices for {noun} ingredients across multiple vendors. Finds the best deals and tracks price changes.", tags: ["F&B", "cost-saving", "B2B", "SaaS"] },
    { title: "{noun} Loyalty Program", description: "Digital loyalty and rewards program for {noun}. Customers earn points, get personalized offers, and track rewards on their phone.", tags: ["F&B", "loyalty", "B2C", "SaaS"] },
    { title: "Health Inspection Checklist for {noun}", description: "Digital health inspection checklists for {noun}. Staff complete daily checks, managers get alerts, and records are always audit-ready.", tags: ["F&B", "compliance", "B2B", "SaaS"] },
    { title: "{noun} Online Ordering System", description: "Commission-free online ordering for {noun}. Includes delivery tracking, kitchen display, and order management.", tags: ["F&B", "e-commerce", "B2B", "SaaS"] },
    { title: "Recipe Cost Calculator for {noun}", description: "Calculates exact recipe costs for {noun} menu items. Updates automatically when ingredient prices change.", tags: ["F&B", "calculator", "cost-saving", "B2B"] },
    { title: "{noun} Staff Scheduler", description: "Shift scheduling tool for {noun} staff. Handles availability, shift swaps, and labor cost optimization.", tags: ["F&B", "scheduling", "B2B", "SaaS"] },
  ],
  "Travel & Hospitality": [
    { title: "Guest Feedback Collector for {noun}", description: "Collects and analyzes guest feedback for {noun} properties. Identifies trends and sends alerts for negative reviews.", tags: ["hospitality", "reviews", "analytics", "B2B"] },
    { title: "{noun} Dynamic Pricing Tool", description: "Adjusts {noun} room rates based on demand, events, and competitor pricing. Maximizes revenue per available room.", tags: ["hospitality", "pricing", "AI", "B2B"] },
    { title: "Local Experience Marketplace for {noun}", description: "Connects {noun} guests with local tours, activities, and dining. Earns commission on every booking.", tags: ["hospitality", "marketplace", "affiliate", "B2C"] },
    { title: "{noun} Check-In Kiosk", description: "Self-service digital check-in for {noun}. Guests verify ID, sign agreements, and get room access codes without front desk.", tags: ["hospitality", "automation", "B2B", "SaaS"] },
    { title: "Housekeeping Management for {noun}", description: "Real-time room status tracking for {noun} housekeeping teams. Prioritizes rooms, tracks cleaning time, and manages inspections.", tags: ["hospitality", "operations", "B2B", "SaaS"] },
    { title: "{noun} Upsell Engine", description: "Sends personalized upsell offers to {noun} guests before and during their stay. Room upgrades, spa packages, and dining reservations.", tags: ["hospitality", "upsell", "marketing", "B2B"] },
    { title: "Travel Itinerary Builder for {noun}", description: "AI-generated travel itineraries for {noun} destinations. Includes maps, booking links, and local tips.", tags: ["travel", "AI", "B2C", "content"] },
    { title: "{noun} Group Booking Manager", description: "Manages group bookings and event blocks for {noun}. Handles room allocations, contracts, and group communications.", tags: ["hospitality", "B2B", "SaaS", "events"] },
  ],
  "Automotive": [
    { title: "Service Reminder System for {noun}", description: "Automated service reminders for {noun} customers based on mileage and time intervals. Includes online booking links.", tags: ["automotive", "automation", "B2B", "local"] },
    { title: "{noun} Parts Finder", description: "Searches multiple {noun} parts suppliers to find the best price and availability. Saves hours of manual searching.", tags: ["automotive", "marketplace", "B2B", "SaaS"] },
    { title: "Vehicle History Reporter for {noun}", description: "Generates comprehensive vehicle history reports for {noun} dealers. Pulls data from multiple sources into one clean report.", tags: ["automotive", "analytics", "B2B", "SaaS"] },
    { title: "{noun} Customer Follow-Up Bot", description: "Automated follow-up sequences for {noun} customers after service visits. Requests reviews, offers seasonal promotions, and re-engages lapsed clients.", tags: ["automotive", "marketing", "automation", "B2B"] },
    { title: "Repair Estimate Generator for {noun}", description: "Digital repair estimates for {noun} shops. Customers get transparent pricing with photos and approve repairs online.", tags: ["automotive", "B2B", "transparency", "local"] },
    { title: "{noun} Fleet Management Lite", description: "Simple fleet management for small {noun} businesses. Tracks maintenance schedules, fuel costs, and driver assignments.", tags: ["automotive", "operations", "B2B", "SaaS"] },
    { title: "Tire Size Finder for {noun}", description: "Embeddable tire size lookup widget for {noun} websites. Customers enter their vehicle, see compatible tires and prices.", tags: ["automotive", "e-commerce", "widget", "B2B"] },
    { title: "{noun} Detailing Booking Platform", description: "Online booking platform for {noun} detailing services. Includes package selection, add-ons, and before/after photo sharing.", tags: ["automotive", "scheduling", "B2B", "local"] },
  ],
  "Legal": [
    { title: "Contract Template Library for {noun}", description: "Pre-built legal contract templates for {noun} businesses. Customizable with clause suggestions and e-signature integration.", tags: ["legal", "templates", "B2B", "SaaS"] },
    { title: "{noun} Client Intake Form", description: "Digital client intake forms for {noun} firms. Auto-populates engagement letters and conflict checks.", tags: ["legal", "automation", "B2B", "SaaS"] },
    { title: "Document Review Assistant for {noun}", description: "AI-powered document review for {noun} legal work. Highlights key clauses, flags risks, and suggests amendments.", tags: ["legal", "AI", "B2B", "SaaS"] },
    { title: "{noun} Time Tracking Tool", description: "Simple time tracking designed for {noun} attorneys. One-click timers, automatic billing entries, and client reporting.", tags: ["legal", "billing", "B2B", "SaaS"] },
    { title: "Compliance Checker for {noun}", description: "Monitors {noun} regulatory requirements and alerts when new rules affect their business. Includes compliance checklists.", tags: ["legal", "compliance", "B2B", "SaaS"] },
    { title: "{noun} Case Status Portal", description: "Client-facing portal for {noun} firms. Clients check case status, view documents, and message their attorney.", tags: ["legal", "portal", "B2B", "SaaS"] },
    { title: "Legal Fee Estimator for {noun}", description: "Online tool that gives {noun} clients transparent fee estimates based on case type and complexity.", tags: ["legal", "calculator", "B2C", "lead-gen"] },
    { title: "{noun} Deadline Tracker", description: "Tracks filing deadlines, statute of limitations, and court dates for {noun} cases. Never miss a critical date.", tags: ["legal", "compliance", "B2B", "SaaS"] },
  ],
  "Marketing": [
    { title: "Social Media Scheduler for {noun}", description: "Schedule and auto-publish {noun} content across multiple social platforms. Includes analytics and best-time-to-post suggestions.", tags: ["marketing", "automation", "SaaS", "B2B"] },
    { title: "{noun} A/B Test Manager", description: "Simple A/B testing platform for {noun} campaigns. Test headlines, images, and CTAs with statistical significance tracking.", tags: ["marketing", "analytics", "SaaS", "B2B"] },
    { title: "Email Warmup Tool for {noun}", description: "Warms up {noun} email domains to improve deliverability. Gradually increases sending volume with engagement simulation.", tags: ["marketing", "email", "SaaS", "B2B"] },
    { title: "{noun} Competitor Tracker", description: "Monitors {noun} competitor websites, social media, and ad campaigns. Alerts you to new products, pricing changes, and content.", tags: ["marketing", "analytics", "competitive", "B2B"] },
    { title: "Landing Page Analyzer for {noun}", description: "AI-powered analysis of {noun} landing pages. Scores copy, design, and CTA placement with actionable improvement suggestions.", tags: ["marketing", "AI", "conversion", "SaaS"] },
    { title: "{noun} Testimonial Collector", description: "Automated testimonial collection for {noun} businesses. Video and text testimonials with approval workflows and embed widgets.", tags: ["marketing", "social-proof", "SaaS", "B2B"] },
    { title: "Content Calendar for {noun}", description: "Visual content calendar for {noun} marketing teams. Plan, assign, and track content across all channels.", tags: ["marketing", "planning", "SaaS", "B2B"] },
    { title: "{noun} UTM Builder", description: "Generates and manages UTM tracking links for {noun} campaigns. Includes a link shortener and click analytics.", tags: ["marketing", "analytics", "SaaS", "B2B"] },
  ],
  "HR & Recruiting": [
    { title: "Job Description Generator for {noun}", description: "AI-generated job descriptions for {noun} roles. Includes bias checking, salary benchmarks, and SEO optimization for job boards.", tags: ["HR", "AI", "B2B", "SaaS"] },
    { title: "{noun} Onboarding Checklist", description: "Digital onboarding checklists for {noun} new hires. Tracks document collection, training completion, and equipment setup.", tags: ["HR", "automation", "B2B", "SaaS"] },
    { title: "Employee Pulse Survey for {noun}", description: "Quick weekly pulse surveys for {noun} teams. Tracks engagement trends, identifies issues early, and benchmarks against industry.", tags: ["HR", "analytics", "B2B", "SaaS"] },
    { title: "{noun} Interview Scheduler", description: "Automated interview scheduling for {noun} hiring. Candidates self-schedule, interviewers get prep materials, and feedback is collected.", tags: ["HR", "scheduling", "automation", "B2B"] },
    { title: "Time-Off Tracker for {noun}", description: "Simple PTO and time-off tracking for {noun} teams. Handles requests, approvals, and calendar integration.", tags: ["HR", "operations", "B2B", "SaaS"] },
    { title: "{noun} Skills Assessment Platform", description: "Pre-hire skills assessments for {noun} candidates. Includes coding tests, personality assessments, and role-specific evaluations.", tags: ["HR", "assessment", "B2B", "SaaS"] },
    { title: "Employee Recognition Board for {noun}", description: "Peer-to-peer recognition platform for {noun} teams. Celebrate wins, give kudos, and tie recognition to company values.", tags: ["HR", "culture", "B2B", "SaaS"] },
    { title: "{noun} Payroll Calculator", description: "Simple payroll calculator for {noun} small businesses. Handles tax withholdings, deductions, and generates pay stubs.", tags: ["HR", "finance", "B2B", "SaaS"] },
  ],
  "Construction": [
    { title: "Project Bid Calculator for {noun}", description: "Estimates project costs for {noun} contractors. Factors in materials, labor, overhead, and profit margin for accurate bids.", tags: ["construction", "calculator", "B2B", "local"] },
    { title: "{noun} Daily Log App", description: "Digital daily logs for {noun} job sites. Capture weather, progress photos, labor hours, and material deliveries.", tags: ["construction", "operations", "B2B", "mobile"] },
    { title: "Subcontractor Directory for {noun}", description: "Searchable directory of vetted subcontractors for {noun} projects. Includes ratings, certifications, and availability.", tags: ["construction", "marketplace", "B2B", "directory"] },
    { title: "{noun} Safety Checklist", description: "Digital safety checklists for {noun} job sites. OSHA-compliant templates with photo documentation and incident reporting.", tags: ["construction", "compliance", "B2B", "safety"] },
    { title: "Material Price Tracker for {noun}", description: "Tracks lumber, steel, and material prices for {noun} projects. Historical charts and price alerts for smart purchasing.", tags: ["construction", "analytics", "B2B", "SaaS"] },
    { title: "{noun} Change Order Manager", description: "Manages change orders for {noun} projects. Digital approval workflows, cost tracking, and client communication.", tags: ["construction", "operations", "B2B", "SaaS"] },
    { title: "Punch List App for {noun}", description: "Digital punch list management for {noun} project closeouts. Assign items, track completion, and get sign-offs.", tags: ["construction", "operations", "B2B", "mobile"] },
    { title: "{noun} Equipment Rental Tracker", description: "Tracks equipment rentals for {noun} projects. Monitors rental periods, costs, and utilization to avoid unnecessary charges.", tags: ["construction", "cost-saving", "B2B", "SaaS"] },
  ],
  "Pet Services": [
    { title: "Pet Grooming Scheduler for {noun}", description: "Online booking for {noun} grooming services. Includes breed-specific service menus, reminders, and before/after galleries.", tags: ["pets", "scheduling", "B2B", "local"] },
    { title: "{noun} Pet Health Tracker", description: "Digital health records for {noun} pet owners. Track vaccinations, medications, vet visits, and dietary needs.", tags: ["pets", "health", "B2C", "SaaS"] },
    { title: "Dog Walker Matching for {noun}", description: "Connects {noun} pet owners with local dog walkers. GPS-tracked walks, photo updates, and automatic billing.", tags: ["pets", "marketplace", "B2C", "platform"] },
    { title: "{noun} Pet Sitting Marketplace", description: "Marketplace connecting {noun} pet owners with trusted pet sitters. Includes insurance, reviews, and secure payments.", tags: ["pets", "marketplace", "B2C", "platform"] },
    { title: "Training Progress Tracker for {noun}", description: "Digital training log for {noun} dog trainers and owners. Track commands learned, behavioral progress, and training goals.", tags: ["pets", "tracking", "B2B", "SaaS"] },
    { title: "{noun} Pet Food Subscription", description: "Customized pet food subscription for {noun} pets. Quiz-based recommendations with auto-delivery and easy adjustments.", tags: ["pets", "e-commerce", "subscription", "B2C"] },
    { title: "Lost Pet Alert System for {noun}", description: "Neighborhood-based lost pet alert system for {noun} communities. Sends notifications to nearby registered pet owners.", tags: ["pets", "community", "B2C", "local"] },
    { title: "{noun} Vet Appointment Reminder", description: "Automated vet appointment reminders for {noun} clinics. Reduces no-shows with multi-channel notifications.", tags: ["pets", "automation", "B2B", "SaaS"] },
  ],
  "Beauty & Wellness": [
    { title: "Salon Booking System for {noun}", description: "Online appointment booking for {noun} salons. Handles multiple stylists, services, and durations with smart scheduling.", tags: ["beauty", "scheduling", "B2B", "SaaS"] },
    { title: "{noun} Client Consultation Form", description: "Digital consultation forms for {noun} professionals. Capture preferences, allergies, and goals before the appointment.", tags: ["beauty", "B2B", "forms", "SaaS"] },
    { title: "Before/After Portfolio for {noun}", description: "Beautiful portfolio builder for {noun} professionals. Showcase transformations with side-by-side comparisons and filters.", tags: ["beauty", "portfolio", "B2B", "marketing"] },
    { title: "{noun} Product Recommender", description: "AI-powered product recommendation engine for {noun} clients. Based on skin type, hair type, and treatment history.", tags: ["beauty", "AI", "e-commerce", "SaaS"] },
    { title: "Spa Package Builder for {noun}", description: "Customizable spa package creator for {noun}. Clients build their own wellness experience with dynamic pricing.", tags: ["beauty", "e-commerce", "B2B", "SaaS"] },
    { title: "{noun} Loyalty Rewards App", description: "Points-based loyalty program for {noun} businesses. Clients earn rewards, refer friends, and get birthday specials.", tags: ["beauty", "loyalty", "B2C", "SaaS"] },
    { title: "Skincare Routine Builder for {noun}", description: "Interactive skincare routine builder for {noun} brands. Quiz-based product recommendations with morning/night routines.", tags: ["beauty", "AI", "B2C", "e-commerce"] },
    { title: "{noun} Staff Availability Manager", description: "Manages availability and schedules for {noun} service providers. Handles time-off requests and break scheduling.", tags: ["beauty", "scheduling", "B2B", "SaaS"] },
  ],
  "Agriculture": [
    { title: "Crop Monitoring Dashboard for {noun}", description: "Satellite and sensor data dashboard for {noun} farmers. Tracks soil moisture, growth stages, and weather forecasts.", tags: ["agriculture", "analytics", "IoT", "B2B"] },
    { title: "{noun} Farm-to-Table Marketplace", description: "Connects {noun} farmers directly with restaurants and consumers. Fresh produce ordering with delivery coordination.", tags: ["agriculture", "marketplace", "B2B", "local"] },
    { title: "Equipment Maintenance Log for {noun}", description: "Digital maintenance logs for {noun} farm equipment. Track service history, parts replacement, and upcoming maintenance.", tags: ["agriculture", "operations", "B2B", "SaaS"] },
    { title: "{noun} Harvest Planner", description: "Plans optimal harvest timing for {noun} crops based on weather forecasts, market prices, and crop maturity data.", tags: ["agriculture", "planning", "AI", "B2B"] },
    { title: "Livestock Health Tracker for {noun}", description: "Digital health records for {noun} livestock. Track vaccinations, weight, feed, and veterinary visits per animal.", tags: ["agriculture", "health", "B2B", "SaaS"] },
    { title: "{noun} Weather Alert System", description: "Hyper-local weather alerts for {noun} farms. Frost warnings, storm alerts, and irrigation recommendations.", tags: ["agriculture", "alerts", "B2B", "SaaS"] },
    { title: "Farm Labor Scheduler for {noun}", description: "Seasonal worker scheduling for {noun} operations. Handles crew assignments, hour tracking, and payroll integration.", tags: ["agriculture", "scheduling", "B2B", "SaaS"] },
    { title: "{noun} Soil Testing Tracker", description: "Tracks soil test results for {noun} fields over time. Recommends fertilizer adjustments based on nutrient trends.", tags: ["agriculture", "analytics", "B2B", "SaaS"] },
  ],
  "Logistics": [
    { title: "Shipment Tracker for {noun}", description: "Real-time shipment tracking across carriers for {noun} businesses. Unified dashboard with customer notification automation.", tags: ["logistics", "tracking", "B2B", "SaaS"] },
    { title: "{noun} Route Optimizer", description: "AI-powered delivery route optimization for {noun} fleets. Minimizes fuel costs and delivery times with dynamic rerouting.", tags: ["logistics", "AI", "B2B", "SaaS"] },
    { title: "Warehouse Inventory Scanner for {noun}", description: "Mobile barcode/QR scanning for {noun} warehouse inventory. Real-time stock counts with location tracking.", tags: ["logistics", "inventory", "B2B", "mobile"] },
    { title: "{noun} Freight Quote Comparison", description: "Compares freight quotes from multiple carriers for {noun} shipments. Find the best rate for LTL, FTL, and parcel.", tags: ["logistics", "marketplace", "B2B", "SaaS"] },
    { title: "Delivery Proof Collector for {noun}", description: "Digital proof of delivery with photos, signatures, and timestamps for {noun} drivers. Reduces delivery disputes.", tags: ["logistics", "operations", "B2B", "mobile"] },
    { title: "{noun} Packing List Generator", description: "Generates optimized packing lists for {noun} orders. Minimizes box sizes and shipping costs with smart packing algorithms.", tags: ["logistics", "automation", "B2B", "SaaS"] },
    { title: "Returns Logistics Platform for {noun}", description: "Manages reverse logistics for {noun}. Handles return labels, inspections, restocking, and refund processing.", tags: ["logistics", "operations", "B2B", "SaaS"] },
    { title: "{noun} Customs Documentation Tool", description: "Generates customs forms and documentation for {noun} international shipments. Reduces delays and compliance issues.", tags: ["logistics", "compliance", "B2B", "SaaS"] },
  ],
  "Entertainment": [
    { title: "Event Ticketing Platform for {noun}", description: "Self-service event ticketing for {noun} venues. Handles seat maps, pricing tiers, and digital ticket delivery.", tags: ["entertainment", "e-commerce", "B2B", "SaaS"] },
    { title: "{noun} Fan Engagement App", description: "Fan engagement platform for {noun} creators. Polls, Q&As, exclusive content, and community features.", tags: ["entertainment", "community", "B2C", "SaaS"] },
    { title: "Venue Booking System for {noun}", description: "Online venue booking for {noun} spaces. Includes availability calendars, pricing packages, and contract signing.", tags: ["entertainment", "scheduling", "B2B", "SaaS"] },
    { title: "{noun} Merch Store Builder", description: "Quick merch store setup for {noun} creators. Print-on-demand integration with zero inventory risk.", tags: ["entertainment", "e-commerce", "B2C", "SaaS"] },
    { title: "Setlist Planner for {noun}", description: "Collaborative setlist planning for {noun} performers. Track song durations, transitions, and audience energy flow.", tags: ["entertainment", "planning", "B2C", "SaaS"] },
    { title: "{noun} Streaming Analytics", description: "Cross-platform streaming analytics for {noun} content creators. Track views, engagement, and revenue across platforms.", tags: ["entertainment", "analytics", "B2C", "SaaS"] },
    { title: "Podcast Guest Matcher for {noun}", description: "Connects {noun} podcast hosts with relevant guests. AI-powered matching based on topics, audience, and availability.", tags: ["entertainment", "marketplace", "AI", "B2B"] },
    { title: "{noun} Content Licensing Platform", description: "Marketplace for licensing {noun} content — music, photos, videos. Handles rights management and royalty tracking.", tags: ["entertainment", "marketplace", "B2B", "platform"] },
  ],
  "Non-Profit": [
    { title: "Donor Management System for {noun}", description: "Simple donor CRM for {noun} organizations. Track donations, send thank-you letters, and manage campaigns.", tags: ["non-profit", "CRM", "B2B", "SaaS"] },
    { title: "{noun} Volunteer Scheduler", description: "Volunteer management and scheduling for {noun}. Sign-up pages, shift management, and hour tracking.", tags: ["non-profit", "scheduling", "B2B", "SaaS"] },
    { title: "Grant Application Tracker for {noun}", description: "Tracks grant applications for {noun} organizations. Deadlines, requirements, status updates, and reporting templates.", tags: ["non-profit", "operations", "B2B", "SaaS"] },
    { title: "{noun} Fundraising Page Builder", description: "Beautiful fundraising page builder for {noun} causes. Includes progress bars, donor walls, and social sharing.", tags: ["non-profit", "fundraising", "B2C", "SaaS"] },
    { title: "Impact Report Generator for {noun}", description: "Auto-generates impact reports for {noun} organizations. Pull data from programs, financials, and outcomes into beautiful reports.", tags: ["non-profit", "reporting", "automation", "B2B"] },
    { title: "{noun} Event Registration Tool", description: "Event registration and ticketing for {noun} fundraisers. Handles tables, sponsorships, and auction items.", tags: ["non-profit", "events", "B2B", "SaaS"] },
    { title: "Membership Portal for {noun}", description: "Member management portal for {noun}. Dues collection, directory, event access, and member communications.", tags: ["non-profit", "portal", "B2B", "SaaS"] },
    { title: "{noun} Newsletter Builder", description: "Easy newsletter builder for {noun} communications. Drag-and-drop templates with donor segmentation and analytics.", tags: ["non-profit", "marketing", "B2B", "SaaS"] },
  ],
};

// Industry-specific nouns for template filling
const INDUSTRY_NOUNS: Record<string, string[]> = {
  "Local Services": ["Plumber", "Electrician", "HVAC", "Landscaping", "Cleaning", "Pest Control", "Locksmith", "Roofing", "Painting", "Moving"],
  "E-commerce": ["Fashion", "Electronics", "Home Decor", "Supplements", "Jewelry", "Outdoor Gear", "Baby Products", "Art Supplies", "Gourmet Food", "Craft Supplies"],
  "Technology": ["SaaS", "Mobile App", "API", "Cloud", "IoT", "DevOps", "Data Pipeline", "Microservice", "Startup", "Open Source"],
  "Health & Fitness": ["CrossFit", "Yoga", "Personal Training", "Nutrition", "Running", "Swimming", "Martial Arts", "Pilates", "Physical Therapy", "Mental Wellness"],
  "Education": ["K-12", "University", "Online Course", "Language Learning", "STEM", "Music", "Test Prep", "Special Education", "Homeschool", "Corporate Training"],
  "Real Estate": ["Residential", "Commercial", "Property Management", "Luxury", "Rental", "Investment", "Vacation Rental", "Co-living", "Senior Living", "Student Housing"],
  "Finance": ["Freelancer", "Small Business", "E-commerce", "Startup", "Restaurant", "Contractor", "Agency", "Clinic", "Non-Profit", "Retail"],
  "Food & Beverage": ["Restaurant", "Cafe", "Food Truck", "Bakery", "Catering", "Brewery", "Juice Bar", "Ghost Kitchen", "Meal Prep", "Farm Stand"],
  "Travel & Hospitality": ["Boutique Hotel", "Hostel", "B&B", "Resort", "Vacation Rental", "Glamping", "Hotel Chain", "Eco Lodge", "Motel", "Serviced Apartment"],
  "Automotive": ["Auto Repair", "Car Dealership", "Tire Shop", "Auto Detailing", "Body Shop", "Car Wash", "Fleet", "Motorcycle", "RV", "Electric Vehicle"],
  "Legal": ["Family Law", "Criminal Defense", "Immigration", "Estate Planning", "Business Law", "Personal Injury", "Intellectual Property", "Employment Law", "Real Estate Law", "Tax Law"],
  "Marketing": ["Agency", "Freelancer", "E-commerce", "SaaS", "Real Estate", "Restaurant", "Clinic", "Startup", "Non-Profit", "Influencer"],
  "HR & Recruiting": ["Tech", "Healthcare", "Retail", "Manufacturing", "Remote", "Startup", "Enterprise", "Agency", "Seasonal", "Executive"],
  "Construction": ["Residential", "Commercial", "Renovation", "Roofing", "Concrete", "Electrical", "Plumbing", "Landscaping", "Demolition", "Specialty"],
  "Pet Services": ["Dog Grooming", "Pet Boarding", "Veterinary", "Pet Store", "Dog Training", "Cat Sitting", "Pet Daycare", "Mobile Vet", "Pet Adoption", "Exotic Pet"],
  "Beauty & Wellness": ["Hair Salon", "Spa", "Nail Studio", "Barbershop", "Aesthetics", "Massage", "Lash Studio", "Tattoo", "Skincare", "Wellness Center"],
  "Agriculture": ["Grain", "Dairy", "Produce", "Vineyard", "Orchard", "Livestock", "Organic", "Greenhouse", "Hemp", "Aquaculture"],
  "Logistics": ["E-commerce", "Cold Chain", "Last Mile", "Cross-Border", "Wholesale", "Furniture", "Medical Supply", "Auto Parts", "Food Delivery", "Hazmat"],
  "Entertainment": ["Music", "Comedy", "Gaming", "Podcast", "Theater", "Dance", "Film", "Art", "Sports", "Magic"],
  "Non-Profit": ["Environmental", "Education", "Health", "Animal Welfare", "Arts", "Community", "Religious", "Youth", "Veterans", "Humanitarian"],
};

// Validation methods per industry
const VALIDATION_METHODS: Record<string, string[]> = {
  "Local Services": ["Cold email 20 local businesses", "Run Facebook ads to a landing page for 1 week", "Post in local business Facebook groups", "Door-to-door visits to 10 businesses", "Partner with one business for a free trial"],
  "E-commerce": ["Launch a minimal Shopify store with 5 products", "Run $50 in Google Shopping ads", "Post product in relevant subreddits", "Create a landing page and drive traffic", "List on Product Hunt"],
  "Technology": ["Build an MVP in a weekend", "Post on Hacker News", "Share in developer Discord communities", "Create a free tier and track signups", "Launch on Product Hunt"],
  "Health & Fitness": ["Offer free trials to 10 people at a local gym", "Create an Instagram page and track engagement", "Post in fitness subreddits", "Partner with a local trainer for feedback", "Run a Facebook group challenge"],
  "Education": ["Offer free access to 20 teachers", "Post in education Facebook groups", "Create a demo and share on Twitter/X", "Partner with one school for a pilot", "Survey 50 educators on their pain points"],
  "Real Estate": ["Demo to 5 local agents", "Post in real estate Facebook groups", "Cold email 30 brokerages", "Attend a local real estate networking event", "Offer a free month to 10 agents"],
  "Finance": ["Offer free access to 20 small businesses", "Post in entrepreneur subreddits", "Cold email 30 accountants", "Create a demo video and share on LinkedIn", "Partner with a bookkeeper for referrals"],
  "Food & Beverage": ["Visit 10 local restaurants with a demo", "Post in restaurant owner Facebook groups", "Offer a free month to 5 businesses", "Partner with a food supplier for referrals", "Cold email 20 restaurant owners"],
  "Travel & Hospitality": ["Demo to 5 local hotels", "Post in hospitality industry forums", "Cold email 30 property managers", "Attend a hospitality trade show", "Offer free setup to 3 properties"],
  "Automotive": ["Visit 10 local auto shops with a demo", "Post in automotive business forums", "Cold email 20 dealerships", "Partner with a parts supplier", "Offer a free trial to 5 shops"],
  "Legal": ["Demo to 5 local law firms", "Post in legal tech forums", "Cold email 30 attorneys", "Attend a local bar association event", "Offer free access to 10 solo practitioners"],
  "Marketing": ["Offer free access to 20 marketers", "Post in marketing subreddits", "Share in marketing Slack communities", "Create a case study with one client", "Launch on Product Hunt"],
  "HR & Recruiting": ["Demo to 5 HR managers", "Post in HR LinkedIn groups", "Cold email 30 recruiting agencies", "Offer free trial to 10 companies", "Attend an HR technology conference"],
  "Construction": ["Visit 10 local contractors", "Post in construction business forums", "Cold email 20 general contractors", "Demo at a local builders association meeting", "Offer free trial to 5 contractors"],
  "Pet Services": ["Visit 10 local pet businesses", "Post in pet business owner groups", "Cold email 20 veterinary clinics", "Partner with a pet supply store", "Offer free trial to 5 groomers"],
  "Beauty & Wellness": ["Visit 10 local salons", "Post in salon owner Facebook groups", "Cold email 20 spa managers", "Demo at a beauty industry trade show", "Offer free month to 5 stylists"],
  "Agriculture": ["Demo to 5 local farmers", "Post in farming forums and Facebook groups", "Attend a county agricultural fair", "Partner with a farm supply store", "Cold email 20 farm operations"],
  "Logistics": ["Demo to 5 logistics companies", "Post in supply chain forums", "Cold email 30 warehouse managers", "Attend a logistics trade show", "Offer free trial to 3 shipping companies"],
  "Entertainment": ["Demo to 5 venue managers", "Post in creator communities", "Cold email 20 event organizers", "Offer free access to 10 creators", "Launch on Product Hunt"],
  "Non-Profit": ["Demo to 5 local non-profits", "Post in non-profit management forums", "Cold email 20 executive directors", "Attend a non-profit conference", "Offer free tier to 10 organizations"],
};

// Seeded pseudo-random number generator for deterministic output
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateAllIdeas(): IdeaEntry[] {
  const seeds = seedIdeas as IdeaEntry[];
  const generated: IdeaEntry[] = [...seeds];
  const usedTitles = new Set(seeds.map((s) => s.title));
  const random = seededRandom(42);

  const industries = Object.keys(TEMPLATES);
  let idCounter = seeds.length + 1;

  // Keep generating until we have 1000
  let safetyCounter = 0;
  while (generated.length < 1000 && safetyCounter < 5000) {
    safetyCounter++;

    const industryIdx = Math.floor(random() * industries.length);
    const industry = industries[industryIdx];
    const templates = TEMPLATES[industry];
    const nouns = INDUSTRY_NOUNS[industry];
    const validations = VALIDATION_METHODS[industry];

    const templateIdx = Math.floor(random() * templates.length);
    const nounIdx = Math.floor(random() * nouns.length);
    const template = templates[templateIdx];
    const noun = nouns[nounIdx];

    const title = template.title.replace(/\{noun\}/g, noun);

    // Skip duplicates
    if (usedTitles.has(title)) continue;
    usedTitles.add(title);

    const description = template.description.replace(/\{noun\}/g, noun);
    const revenueIdx = Math.floor(random() * REVENUE_TIERS.length);
    const timeIdx = Math.floor(random() * TIME_INVESTMENTS.length);
    const diffIdx = Math.floor(random() * DIFFICULTIES.length);
    const costIdx = Math.floor(random() * STARTUP_COSTS.length);
    const monetizationIdx = Math.floor(random() * MONETIZATION_MODELS.length);
    const toolIdx = Math.floor(random() * TOOL_STACKS.length);
    const validationIdx = Math.floor(random() * validations.length);
    const score = Math.floor(random() * 5) + 6; // 6-10

    const idea: IdeaEntry = {
      id: `idea-${String(idCounter).padStart(3, "0")}`,
      title,
      description,
      industry,
      revenue_tier: REVENUE_TIERS[revenueIdx],
      time_investment: TIME_INVESTMENTS[timeIdx],
      invisibility_score: score,
      technical_difficulty: DIFFICULTIES[diffIdx],
      startup_cost: STARTUP_COSTS[costIdx],
      example_tools: TOOL_STACKS[toolIdx],
      monetization_model: MONETIZATION_MODELS[monetizationIdx],
      validation_method: validations[validationIdx],
      tags: template.tags,
      is_featured: false,
    };

    generated.push(idea);
    idCounter++;
  }

  return generated;
}

export const allIdeas: IdeaEntry[] = generateAllIdeas();
