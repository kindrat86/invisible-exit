import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * AttributionSurvey — AEO Module 4 (self-reported attribution).
 *
 * The single most reliable way to tie AI visibility to revenue. AI referral
 * traffic is severely undercounted in GA4 (no referrer on in-content links,
 * desktop apps, etc.) — most AI-influenced conversions land as "direct" or
 * "organic brand search". Asking the user directly captures what analytics
 * can't. Ahrefs: ~3% of conversions came from AI self-reported, converting
 * 23× the rate of organic.
 *
 * Fires once per user, on first Dashboard visit after the survey is shipped.
 * Gated by localStorage flag `attribution_survey_v1_<userId>` (same pattern
 * as onboarding_completed_<userId>).
 *
 * Options follow the AEO skill's recommended set. Tracked via PostHog as a
 * person property (`attribution_source`) AND an event, so cohort analysis
 * works either way.
 */

const OPTIONS = [
  { value: "ai_assistant", label: "AI assistant (ChatGPT / Claude / Gemini / Copilot)" },
  { value: "perplexity", label: "Perplexity" },
  { value: "google_aio", label: "AI search / Google AI Overviews" },
  { value: "google_search", label: "Google search (regular blue links)" },
  { value: "youtube", label: "YouTube" },
  { value: "reddit", label: "Reddit / forum / community" },
  { value: "social", label: "Social media (X, LinkedIn, etc.)" },
  { value: "referral_friend", label: "Referral / friend / word of mouth" },
  { value: "podcast", label: "Podcast / newsletter" },
  { value: "other", label: "Other" },
] as const;

type AttributionSource = (typeof OPTIONS)[number]["value"];

const STORAGE_KEY = (userId: string) => `attribution_survey_v1_${userId}`;

interface Props {
  userId: string;
  /**
   * Delay before showing the dialog, so it doesn't fight with onboarding or
   * the dashboard's own loading skeleton. Caller can pass 0 for tests.
   */
  delayMs?: number;
}

export default function AttributionSurvey({ userId, delayMs = 1500 }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AttributionSource | null>(null);
  const [otherText, setOtherText] = useState("");

  useEffect(() => {
    if (!userId) return;
    const done = localStorage.getItem(STORAGE_KEY(userId));
    if (done) return;

    const t = setTimeout(() => {
      setOpen(true);
      trackEvent("attribution_survey_shown");
    }, delayMs);
    return () => clearTimeout(t);
  }, [userId, delayMs]);

  const handleSubmit = () => {
    if (!selected) return;
    const source = selected === "other" && otherText.trim() ? `other: ${otherText.trim().slice(0, 80)}` : selected;
    trackEvent("attribution_survey_submitted", { attribution_source: source });
    // Persist as a person property for cohort analysis. posthog.identify is
    // idempotent; safe to call again to merge properties.
    import("@/integrations/posthog").then(({ default: posthog }) => {
      posthog.identify?.(userId, { attribution_source: source, attribution_captured_at: new Date().toISOString() });
    });
    localStorage.setItem(STORAGE_KEY(userId), new Date().toISOString());
    setOpen(false);
  };

  const handleDismiss = () => {
    trackEvent("attribution_survey_dismissed");
    // Mark as seen so it doesn't nag — but don't record a source. A dismiss
    // is still signal (the user didn't want to answer); we won't re-prompt.
    localStorage.setItem(STORAGE_KEY(userId), new Date().toISOString());
    setOpen(false);
  };

  // Prevent body scroll underneath while open (Radix Dialog handles this, but
  // the explicit guard keeps it robust if the parent sets overflow elsewhere).
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleDismiss()}>
      <DialogContent className="max-w-md bg-[#1B2A4A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Quick one — how did you first hear about Invisible Exit?
          </DialogTitle>
          <DialogDescription className="text-white/70">
            One tap. Helps us know what's actually working so we can do more of it.
            We only ask once.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selected ?? ""}
          onValueChange={(v) => setSelected(v as AttributionSource)}
          className="grid gap-2 mt-2"
        >
          {OPTIONS.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-3 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors px-3 py-2.5 cursor-pointer"
              onClick={() => setSelected(opt.value)}
            >
              <RadioGroupItem
                value={opt.value}
                id={`attr-${opt.value}`}
                className="border-white/40 text-blue-500"
              />
              <Label
                htmlFor={`attr-${opt.value}`}
                className="text-sm text-white/90 cursor-pointer flex-1"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selected === "other" && (
          <input
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Where? (optional)"
            maxLength={80}
            className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
          />
        )}

        <div className="flex items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            Skip
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!selected || (selected === "other" && !otherText.trim())}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
