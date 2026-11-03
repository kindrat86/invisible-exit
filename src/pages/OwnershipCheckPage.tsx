import { useMemo, useState } from "react";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  assessOwnershipRisk,
  ALL_STATE_CODES,
  NOT_LEGAL_ADVICE,
  PRIOR_INVENTIONS_TEMPLATE,
  DISCLOSURE_TEMPLATE,
  SEPARATION_CHECKLIST,
  type CheckAnswers,
  type CheckResult,
} from "@/lib/ownership-check";
import ipStatutes from "@/data/ip-statutes.json";

const stateName = (code: string) =>
  (ipStatutes.states as Record<string, { name: string }>)[code]?.name ?? code;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard may be blocked; the textarea below remains selectable */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}

function RiskBadge({ level }: { level: CheckResult["level"] }) {
  const styles: Record<CheckResult["level"], string> = {
    low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    moderate: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
    elevated: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
    high: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} risk
    </span>
  );
}

function QuestionRow({
  id,
  label,
  hint,
  checked,
  onChange,
  invert,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  /** invert=true: the RISKY answer is "checked" */
  invert?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5"
        aria-label={label}
      />
      <div className="min-w-0">
        <Label htmlFor={id} className="cursor-pointer text-sm font-semibold leading-snug text-foreground">
          {label}
        </Label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      {invert ? null : null}
    </div>
  );
}

export default function OwnershipCheckPage() {
  const [workState, setWorkState] = useState("");
  const [governingState, setGoverningState] = useState("");
  const [ownTimeOnly, setOwnTimeOnly] = useState(true);
  const [ownEquipment, setOwnEquipment] = useState(true);
  const [overlaps, setOverlaps] = useState(false);
  const [jobDuties, setJobDuties] = useState(false);
  const [clauseText, setClauseText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [govDiffers, setGovDiffers] = useState(false);

  const answers: CheckAnswers = useMemo(
    () => ({
      workState,
      governingState: govDiffers ? governingState : "",
      ownTimeOnly,
      ownEquipmentAndAccountsOnly: ownEquipment,
      overlapsEmployerBusiness: overlaps,
      fromJobDuties: jobDuties,
      clauseText,
    }),
    [workState, governingState, govDiffers, ownTimeOnly, ownEquipment, overlaps, jobDuties, clauseText],
  );

  const result = useMemo(() => assessOwnershipRisk(answers), [answers]);

  const canSubmit = workState !== "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Who Owns Your Side Project? Free Side-Project Ownership Check | Invisible Exit"
        description="Free 6-question check: can your employer claim your side project? Quotes your state's invention-assignment statute from the official source, flags risky phrases in your own contract clause, and gives you a next-step pack. Client-side only, nothing is uploaded."
        url="/check"
      />
      <Navbar />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <div className="page-fade">
          <span className="content-tag content-tag-green mb-3">⚖️ Free tool</span>
          <h1 className="text-h1 text-foreground">Side-Project Ownership Check</h1>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Can your employer claim the side business you are building? Answer 6 questions and
            optionally paste the invention-assignment or outside-employment clause from your
            contract. You get your state's actual statute, quoted from the official legislature
            source, the phrases in your clause that broaden your employer's claim, and a concrete
            next-step pack.
          </p>
          <p className="mt-3 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
            {NOT_LEGAL_ADVICE}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Everything runs in your browser: your answers and your pasted clause are never uploaded
            or stored.
          </p>

          {/* Questions */}
          <section className="mt-10 space-y-4" aria-label="Questions">
            <h2 className="text-xl font-bold text-foreground">6 questions</h2>

            <div className="rounded-xl border border-border bg-card p-4">
              <Label htmlFor="work-state" className="text-sm font-semibold text-foreground">
                1. Where do you work? (state)
              </Label>
              <p className="mb-2 mt-1 text-xs text-muted-foreground">
                The state where you physically work usually decides which statute applies, unless
                your contract says otherwise.
              </p>
              <Select value={workState} onValueChange={setWorkState}>
                <SelectTrigger id="work-state" className="w-full">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {ALL_STATE_CODES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {stateName(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gov-differs"
                  checked={govDiffers}
                  onCheckedChange={(v) => setGovDiffers(v === true)}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="gov-differs" className="cursor-pointer text-sm font-semibold text-foreground">
                    2. My contract names a different governing-law state
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Many agreements say "this agreement is governed by the laws of X". If yours does,
                    tick this and pick X: the check uses that state's statute.
                  </p>
                </div>
              </div>
              {govDiffers && (
                <div className="mt-3">
                  <Select value={governingState} onValueChange={setGoverningState}>
                    <SelectTrigger id="governing-state" className="w-full" aria-label="Governing-law state">
                      <SelectValue placeholder="Governing-law state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {ALL_STATE_CODES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {stateName(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <QuestionRow
              id="q-own-time"
              label="3. I built it entirely on my own time (never during working hours)"
              hint="The own-time carve-out statutes protect only work developed entirely on your own time. Even occasional work-hours work removes that protection."
              checked={ownTimeOnly}
              onChange={setOwnTimeOnly}
            />
            <QuestionRow
              id="q-own-equipment"
              label="4. I used only my own equipment and accounts (never the employer's laptop, licenses, systems or data)"
              hint="Carve-outs require no employer equipment, supplies, facilities, or trade secret information. A work laptop or work SaaS account takes the project outside the carve-out."
              checked={ownEquipment}
              onChange={setOwnEquipment}
            />
            <QuestionRow
              id="q-overlap"
              label="5. My project overlaps my employer's business or its anticipated R&D"
              hint="This is the exception written into the statutes themselves: own-time work that relates to the employer's business, or actual or demonstrably anticipated research or development, can still be assigned. Answer honestly: this is the most common way side projects are lost."
              checked={overlaps}
              onChange={setOverlaps}
            />
            <QuestionRow
              id="q-job-duties"
              label="6. The idea or any part of it resulted from work I performed for my employer"
              hint="If solving a problem at work produced the idea, that result is excluded from every carve-out and assigned under standard agreements."
              checked={jobDuties}
              onChange={setJobDuties}
            />

            <div className="rounded-xl border border-border bg-card p-4">
              <Label htmlFor="clause" className="text-sm font-semibold text-foreground">
                Optional: paste your invention-assignment or outside-employment clause
              </Label>
              <p className="mb-2 mt-1 text-xs text-muted-foreground">
                Find headings like "Inventions", "Intellectual Property", "Outside Activities" or
                "Assignment" in your offer letter, employment agreement, PIIA or CIIAA. Paste the
                text here and the check flags the phrases that broaden your employer's claim. The
                text stays in your browser.
              </p>
              <Textarea
                id="clause"
                value={clauseText}
                onChange={(e) => setClauseText(e.target.value)}
                placeholder='e.g. "Employee hereby assigns to the Company all inventions conceived during the term of employment, whether or not during working hours..."'
                className="min-h-32 font-mono text-xs"
              />
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!canSubmit}
              onClick={() => {
                setShowResult(true);
                setTimeout(
                  () => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }),
                  50,
                );
              }}
            >
              {canSubmit ? "Check ownership risk" : "Select your state first"}
            </Button>
          </section>

          {/* Result */}
          {showResult && (
            <section id="result" className="mt-12 space-y-6" aria-label="Result">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-foreground">{result.headline}</h2>
                <RiskBadge level={result.level} />
              </div>

              {result.seeLawyer && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    See a lawyer before you go further.
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300/90">
                    Your answers place this in the high-risk zone (project overlapping your
                    employer's business, work-time involvement, or a state that defaults toward the
                    employer). A one-hour consultation with an employment lawyer licensed in your
                    state costs far less than losing the project. This tool cannot weigh your
                    specific contract and facts; a lawyer can.
                  </p>
                </div>
              )}

              {/* Reasons */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-foreground">What drove this result</h3>
                  <ul className="mt-4 space-y-4">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          className={`mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                            r.weight === "high"
                              ? "bg-red-500"
                              : r.weight === "warn"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          aria-hidden
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Statute */}
              {result.statute && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-foreground">
                      The statute in {result.statute.stateName}
                      {result.statute.citation ? ` (${result.statute.citation})` : ""}
                    </h3>
                    {result.statute.operativeText ? (
                      <>
                        <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                          Operative text, quoted from the official source
                        </p>
                        <blockquote className="mt-2 whitespace-pre-wrap rounded-lg border-l-4 border-border bg-muted/50 p-4 text-sm leading-relaxed text-foreground">
                          {result.statute.operativeText}
                        </blockquote>
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        No statute limiting invention-assignment provisions was found in{" "}
                        {result.statute.stateName} (checked against the official code and
                        state-by-state surveys on {ipStatutes.sources_verified}). Your contract
                        governs: whatever your agreement says about ownership, plus ordinary
                        contract law and federal patent/copyright defaults.
                      </p>
                    )}
                    <a
                      href={result.statute.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
                    >
                      Read it on the official {result.statute.stateName} source
                    </a>
                    {result.statute.noticeRequirement && (
                       <p className="mt-3 text-sm text-muted-foreground">
                         <strong className="text-foreground">Notice requirement:</strong>{" "}
                         {result.statute.noticeRequirement}
                       </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Clause flags */}
              {result.clauseFlags.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-foreground">Your clause, flagged</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Phrases from the text you pasted, with what each one does.
                    </p>
                    <ul className="mt-4 space-y-4">
                      {result.clauseFlags.map((f) => (
                        <li key={f.phrase} className="rounded-lg border border-border p-4">
                          <p className="font-mono text-sm font-semibold text-primary">
                            "{f.phrase}"
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.why}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Next-step pack */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-foreground">Your next-step pack</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Three documents to prepare, whatever your risk level. Copy, fill the brackets,
                    keep copies.
                  </p>
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="prior">
                      <AccordionTrigger>1. Prior-inventions list (template)</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2 text-sm text-muted-foreground">
                          If your agreement (or your state's statute) contemplates a prior-inventions
                          exclusion, this list is how you use it. File it, keep proof you filed it.
                        </p>
                        <CopyButton text={PRIOR_INVENTIONS_TEMPLATE} label="Copy template" />
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed text-foreground">
                          {PRIOR_INVENTIONS_TEMPLATE}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="disclosure">
                      <AccordionTrigger>2. Side-project disclosure / approval request (template)</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2 text-sm text-muted-foreground">
                          A written record beats a hallway conversation. If approval is denied, you
                          want that in writing too, before you invest more.
                        </p>
                        <CopyButton text={DISCLOSURE_TEMPLATE} label="Copy template" />
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed text-foreground">
                          {DISCLOSURE_TEMPLATE}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="separation">
                      <AccordionTrigger>3. Separation checklist</AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-2 text-sm text-muted-foreground">
                          For the day you leave: what to export, rebuild and keep as evidence of
                          own-time development.
                        </p>
                        <CopyButton text={SEPARATION_CHECKLIST} label="Copy checklist" />
                        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-4 text-xs leading-relaxed text-foreground">
                          {SEPARATION_CHECKLIST}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <p className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
                {NOT_LEGAL_ADVICE} Statute quotes verified {ipStatutes.sources_verified}.
              </p>

              <Button
                variant="outline"
                onClick={() => {
                  setShowResult(false);
                  document.getElementById("result")?.scrollIntoView({ behavior: "smooth" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Change my answers
              </Button>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
