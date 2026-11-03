import { Link } from "react-router-dom";
// NOTE: imported eagerly by App.tsx, keep this module free of heavy deps
// (no recharts/html2canvas) so the entry bundle stays lean.
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import {
  Scale,
  ArrowRight,
  Check,
  Lock,
  FileText,
  AlertTriangle,
  BookOpen,
  ShieldCheck,
  Landmark,
  ListChecks,
  Send,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Homepage, phase 4 of the invisibleexit-rework directive (2026-11-03).
 *
 * The site's value moment is the Side-Project Ownership Check at /check, so the
 * homepage leads straight to it with ONE honest promise: what the check gives
 * you in about 3 minutes. No revenue claims, no invented outcomes, no fake
 * social proof (the old sales page promised "$4,000/month" with zero customers
 * behind it; that promise is gone, along with the whole 2,300-line sales page).
 *
 * Everything claimed here is verifiable:
 *  - "50 states + DC" and the statute quotes come from src/data/ip-statutes.json
 *    (unit-tested: official-source URLs only), built in phase 2.
 *  - The check runs client-side (phase 3): answers never leave the browser.
 *  - The membership strip states the real live $9/month offer, one line, low-key.
 */

const HERO_PROMISE_POINTS = [
  "Your state's actual invention-assignment statute, quoted from the official legislature source",
  "The phrases in your own contract clause that broaden your employer's claim",
  "A next-step pack: prior-inventions list, disclosure request, separation checklist",
];

const WHAT_YOU_GET = [
  {
    icon: AlertTriangle,
    title: "An honest risk level",
    body: "Low, moderate, elevated or high, with the specific reasons that drove it. No scare tactics: if your situation looks protected, it says so.",
  },
  {
    icon: Landmark,
    title: "Your state's real statute",
    body: "The operative text of the own-time carve-out (where your state has one), or a plain statement that no statute exists and your contract governs. Always linked to the official source.",
  },
  {
    icon: FileText,
    title: "Your clause, flagged",
    body: "Paste your invention-assignment or outside-employment clause and see which phrases, like \"hereby assign\" or \"whether or not during working hours\", actually do.",
  },
  {
    icon: ListChecks,
    title: "A next-step pack",
    body: "Three practical templates: a prior-inventions list, a written side-project disclosure request, and a separation checklist for the day you leave.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Answer 6 questions",
    body: "Your state, whose equipment and time you used, whether the project overlaps your employer's business, and whether the idea came from your job.",
  },
  {
    num: "2",
    title: "Optionally paste your clause",
    body: "The invention-assignment or outside-employment section of your offer letter, employment agreement, PIIA or CIIAA. This step is optional but it is where the specifics live.",
  },
  {
    num: "3",
    title: "Read your result",
    body: "Risk level with reasons, the statute quote with its official link, your flagged clause phrases, and the next-step pack. About 3 minutes end to end.",
  },
];

const KEEP_READING = [
  {
    icon: BookOpen,
    title: "State side-business guides",
    body: "LLC filing fees, non-compete enforcement and anonymous-LLC rules for every state.",
    to: "/guides",
  },
  {
    icon: ShieldCheck,
    title: "NDA & non-compete guides",
    body: "How NDAs and non-competes are treated in your state, in plain English.",
    to: "/nda-guides",
  },
  {
    icon: Scale,
    title: "Non-compete scanner",
    body: "Paste your whole contract and get every restrictive clause flagged and scored.",
    to: "/tools/non-compete-scanner",
  },
  {
    icon: FileText,
    title: "Freedom number calculator",
    body: "Once ownership is clear: the monthly revenue that would replace your salary.",
    to: "/freedom",
  },
];

const FAQS = [
  {
    q: "Is this legal advice?",
    a: "No. The Side-Project Ownership Check is an informational tool, not a lawyer. It quotes statutes and flags contract language so you know what to look at and what to ask a lawyer about. For anything high-risk, especially if your project overlaps your employer's business, spend an hour with an employment lawyer licensed in your state before going further.",
  },
  {
    q: "Where do the statute quotes come from?",
    a: "From the official sources: state legislature and official code websites, verified link by link when the dataset was built. Every statute the check shows you carries its own link to the official page so you can read the original yourself.",
  },
  {
    q: "Does every state protect side projects built on my own time?",
    a: "No. Ten states (including California, Washington, New York and Illinois) have statutes that limit invention-assignment clauses for work done entirely on your own time, without employer resources, outside the employer's business. Most states have no such statute: there, your contract governs. The check tells you which situation you are in and shows the exact text.",
  },
  {
    q: "Do you store my answers or my contract clause?",
    a: "No. The check runs entirely in your browser. Your answers and any pasted clause text are processed locally and never uploaded, logged or stored. Close the tab and they are gone.",
  },
  {
    q: "What if the idea came from my job?",
    a: "That is the clearest risk in every state: if the idea resulted from work you performed for your employer, it falls outside every own-time carve-out and standard agreements assign it to the employer. The check flags this and tells you to see a lawyer.",
  },
  {
    q: "What is the $9/month membership?",
    a: "Invisible Exit also has a membership with planning tools for building a side business while employed, from $9/month. You do not need it to use the check or the guides; the check stays free.",
  },
  {
    q: "Is Invisible Exit the video game Invisible, Inc., or a business-exit planning service?",
    a: "Neither. Invisible Exit is a site for employed founders: free client-side tools and guides about the legal and practical sides of building a side business while you have a day job. The name means leaving employment quietly on your own terms.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Who Owns Your Side Project? Free Ownership Check | Invisible Exit"
        description="Free 3-minute check: can your employer claim your side project? Quotes your state's invention-assignment statute from the official source, flags risky phrases in your own contract clause, and gives you a next-step pack. Runs in your browser, nothing uploaded."
        url="/"
      />
      {/* Structured data (Organization, WebSite, WebApplication, FAQPage,
          SoftwareApplication) is emitted once from index.html, which owns the
          canonical @id-keyed nodes. This component emits none to avoid
          duplicate conflicting entities; the FAQ entries below are kept in
          sync with index.html's FAQPage. */}
      <Navbar />

      <main>
        {/* ── 1. Hero: one promise, one CTA → /check ── */}
        <section className="hero-dark-radial pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 section">
          <div className="container-narrow text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-primary-light font-semibold uppercase tracking-wider">
                Free tool · 50 states + DC · Runs in your browser
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-up text-balance">
              Can your employer claim the{" "}
              <span className="text-gradient-light">side project</span>{" "}
              you are building?
            </h1>

            <p className="text-body-lg text-white/80 max-w-2xl mx-auto mb-4 animate-fade-up" style={{ animationDelay: "50ms" }}>
              Answer 6 questions and, in about 3 minutes, know where you actually
              stand: your state's real invention-assignment statute, the phrases in
              your own contract clause that broaden your employer's claim, and what
              to do next.
            </p>

            <p className="text-sm text-white/50 max-w-xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Before you invest evenings and weekends in a side business, this is
              the question worth answering first. The check quotes the law from the
              official source. It is not legal advice.
            </p>

            <div className="flex flex-col items-center gap-4 mb-10 animate-fade-up" style={{ animationDelay: "150ms" }}>
              <Link
                to="/check"
                onClick={() => trackEvent("homepage_hero_cta_check")}
                className="btn-primary w-full sm:w-auto text-lg px-8 inline-flex items-center justify-center gap-2"
              >
                Run the free ownership check
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-white/60">
                6 questions, about 3 minutes. No signup. Nothing is uploaded.
              </p>
            </div>

            <div className="max-w-2xl mx-auto text-left animate-fade-up" style={{ animationDelay: "200ms" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 text-center">
                What you walk away with
              </p>
              <ul className="space-y-2.5">
                {HERO_PROMISE_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-white/75">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 2. Trust strip: privacy + honesty ── */}
        <section className="bg-surface section-normal border-y border-border">
          <div className="container-standard">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Nothing leaves your browser</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Your answers and your pasted clause are processed client-side. No
                  upload, no storage, no account.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Official sources only</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Every statute quote links to the legislature or official code page
                  it came from, verified when the dataset was built.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-foreground">Not legal advice, plainly</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  An informational tool that shows you the law and what to ask a
                  lawyer about. It says so on every result.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. How it works ── */}
        <section className="bg-white section-normal">
          <div className="container-standard">
            <div className="text-center mb-12">
              <p className="text-eyebrow text-primary mb-3">How it works</p>
              <h2 className="text-h2 text-foreground mb-4">About 3 minutes, start to finish</h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                No account, no email wall. The result appears the moment you submit,
                in your browser.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step) => (
                <div key={step.num} className="card-base p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-sm">{step.num}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/check"
                onClick={() => trackEvent("homepage_steps_cta_check")}
                className="btn-primary inline-flex items-center gap-2 px-7"
              >
                Start the check
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 4. What you get ── */}
        <section className="bg-surface section-normal border-y border-border">
          <div className="container-standard">
            <div className="text-center mb-12">
              <p className="text-eyebrow text-primary mb-3">What you get</p>
              <h2 className="text-h2 text-foreground mb-4">The whole result, all at once</h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Everything below appears on one result page. Copy the templates,
                follow the statute links, decide your next move.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHAT_YOU_GET.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="card-base p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. The statute card: one concrete example ── */}
        <section className="bg-white section-normal">
          <div className="container-narrow">
            <div className="card-base p-8 sm:p-10">
              <p className="text-eyebrow text-primary mb-3">Straight from the source</p>
              <h2 className="text-h2 text-foreground mb-4">
                A real statute, not a paraphrase
              </h2>
              <p className="text-body text-muted-foreground mb-6">
                Ten states have statutes that stop employers from claiming work you
                did entirely on your own time, with your own equipment, outside
                their business. California's is the best known. This is the kind of
                text the check shows you, quoted from the official source:
              </p>
              <blockquote className="border-l-4 border-primary bg-muted/50 p-5 text-sm leading-relaxed text-foreground mb-4">
                Any provision in an employment agreement which provides that an
                employee shall assign, or offer to assign, any of his or her rights
                in an invention to his or her employer shall not apply to an
                invention that the employee developed entirely on his or her own
                time without using the employer's equipment, supplies, facilities,
                or trade secret information except for those inventions that either:
                (1) Relate at the time of conception or reduction to practice of the
                invention to the employer's business, or actual or demonstrably
                anticipated research or development of the employer; or (2) Result
                from any work performed by the employee for the employer.
              </blockquote>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <a
                  href="https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=LAB&division=3.&title=&part=&chapter=2.&article=3.5."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4"
                >
                  Cal. Lab. Code § 2870, official source
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>
                  Read the exceptions closely: they are exactly what the check asks
                  you about.
                </span>
              </div>
              <div className="mt-6">
                <Link
                  to="/check"
                  onClick={() => trackEvent("homepage_statute_cta_check")}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  See the statute for your state
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Keep reading: the kept guides, now wired to /check ── */}
        <section className="bg-surface section-normal border-y border-border">
          <div className="container-standard">
            <div className="text-center mb-12">
              <p className="text-eyebrow text-primary mb-3">Keep reading</p>
              <h2 className="text-h2 text-foreground mb-4">Ownership first, then the rest</h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Once you know where you stand on ownership, these take the next
                questions: forming the entity, restrictive covenants, and the money
                math.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {KEEP_READING.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => trackEvent("homepage_guide_click", { to: item.to })}
                    className="card-base p-6 card-hover group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.body}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:text-primary-hover transition-colors">
                      Open
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. The next-step pack, previewed ── */}
        <section className="bg-white section-normal">
          <div className="container-standard">
            <div className="text-center mb-12">
              <p className="text-eyebrow text-primary mb-3">After the result</p>
              <h2 className="text-h2 text-foreground mb-4">
                Three documents that protect you later
              </h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Whatever your risk level, the result ends with templates you can
                copy and fill in today.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-base p-6">
                <FileText className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-2">Prior-inventions list</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A dated record of what existed before you signed, or before you
                  started building. If your agreement or statute has a
                  prior-inventions exclusion, this list is how you use it.
                </p>
              </div>
              <div className="card-base p-6">
                <Send className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-2">Disclosure request</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A short written request for approval of your side project. A
                  written record beats a hallway conversation, and a written denial
                  is worth knowing before you invest more.
                </p>
              </div>
              <div className="card-base p-6">
                <LogOut className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-sm font-bold text-foreground mb-2">Separation checklist</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  For the day you leave: what to export, what to rebuild, and what
                  evidence of own-time development to keep, so the record survives
                  the transition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. About, honestly ── */}
        <section className="bg-surface section-normal border-y border-border">
          <div className="container-narrow text-center">
            <p className="text-eyebrow text-primary mb-3">Who builds this</p>
            <h2 className="text-h2 text-foreground mb-4">
              A site for people building quietly
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-6">
              Invisible Exit is written for employed founders: the legal and
              practical sides of building a side business while you still have a
              day job. The tools are free and run in your browser. The guides cite
              official sources. The founder goes by Adrian; his identity page and
              the full story are on the site.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/about" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover transition-colors">
                About Invisible Exit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/adrian" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover transition-colors">
                Who is Adrian
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 9. Membership strip: the real offer, one honest line ── */}
        <section className="bg-white section-normal">
          <div className="container-narrow">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground mb-1">
                  There is also a membership
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Planning tools for building a side business while employed, from
                  $9/month. You do not need it for the check or the guides; those
                  stay free.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors px-4 py-2.5 rounded-lg border border-border"
                >
                  See pricing
                </Link>
                <Link
                  to="/start"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors px-4 py-2.5 rounded-lg"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10. FAQ ── */}
        <section className="bg-surface section-normal border-t border-border">
          <div className="container-narrow">
            <div className="text-center mb-10">
              <p className="text-eyebrow text-primary mb-3">FAQ</p>
              <h2 className="text-h2 text-foreground">Straight answers</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="card-base p-5 group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-primary text-lg leading-none group-open:rotate-45 transition-transform shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. Final CTA ── */}
        <section className="hero-dark-radial section">
          <div className="container-narrow text-center">
            <h2 className="text-h2 text-white mb-4 text-balance">
              Know where you stand before you build
            </h2>
            <p className="text-body-lg text-white/70 max-w-xl mx-auto mb-8">
              The check is free, it takes about 3 minutes, and nothing you enter
              leaves your browser.
            </p>
            <Link
              to="/check"
              onClick={() => trackEvent("homepage_final_cta_check")}
              className="btn-primary text-lg px-8 inline-flex items-center gap-2"
            >
              Run the free ownership check
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-4 text-xs text-white/40">
              Informational tool, not legal advice. Statute quotes link to official
              legislature sources.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
