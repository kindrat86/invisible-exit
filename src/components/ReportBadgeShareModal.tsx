import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Copy, Check, ExternalLink, ShieldCheck, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { generateReportBadge, type ReportBadgeData } from "@/lib/generateReportBadge";

interface ReportBadgeShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badgeData: ReportBadgeData;
}

const SHARE_URL = "https://invisibleexit.com/fym?utm_source=badge&utm_medium=share&utm_campaign=report";
const REDDIT_BASE_URL = "https://invisibleexit.com/fym?utm_source=reddit&utm_medium=badge&utm_campaign=report";

export default function ReportBadgeShareModal({
  open,
  onOpenChange,
  badgeData,
}: ReportBadgeShareModalProps) {
  const [badgeUrl, setBadgeUrl] = useState<string | null>(null);
  const [badgeBlob, setBadgeBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      // Clean up on close
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      setBadgeUrl(null);
      setBadgeBlob(null);
      return;
    }

    let cancelled = false;

    async function generate() {
      setGenerating(true);
      try {
        const blob = await generateReportBadge(badgeData);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        // Clean up previous URL
        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }
        prevUrlRef.current = url;
        setBadgeUrl(url);
        setBadgeBlob(blob);
        // TODO: Track report_badge_generated event when analytics is set up
      } catch {
        if (!cancelled) {
          toast.error("Failed to generate badge.");
        }
      }
      if (!cancelled) setGenerating(false);
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, [open, badgeData]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  const handleDownload = () => {
    if (!badgeUrl || !badgeBlob) return;

    const now = new Date();
    const month = now.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
    const year = now.getFullYear();
    const filename = `fym-report-level-${badgeData.freedomLevel}-${month}-${year}.png`;

    const link = document.createElement("a");
    link.href = badgeUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Badge saved.");
    // TODO: Track report_badge_downloaded event when analytics is set up
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success("Link copied.");
      setTimeout(() => setCopied(false), 2000);
      // TODO: Track report_badge_link_copied event when analytics is set up
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleShareReddit = () => {
    const title = encodeURIComponent(
      `My FYM Report: Level ${badgeData.freedomLevel} (${badgeData.levelName}). Calculate your FYM score.`
    );
    const url = encodeURIComponent(REDDIT_BASE_URL);
    window.open(
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
      "_blank",
      "noopener,noreferrer"
    );
    // TODO: Track report_badge_reddit_clicked event when analytics is set up
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your FYM Report</DialogTitle>
        </DialogHeader>

        {/* Badge preview */}
        <div className="rounded-lg overflow-hidden bg-[#0a1628] flex items-center justify-center">
          {generating || !badgeUrl ? (
            <Skeleton className="w-full aspect-[1200/630] bg-white/10" />
          ) : (
            <img
              src={badgeUrl}
              alt="FYM Report Badge"
              className="w-full h-auto"
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={generating || !badgeUrl}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>

          <Button variant="outline" onClick={handleCopyLink} className="w-full">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </>
            )}
          </Button>

          <Button variant="outline" onClick={handleShareReddit} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Share to Reddit
          </Button>
        </div>

        {/* Safety note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
          <span>No personal info included. Safe to share anywhere.</span>
        </div>

        {/* Reddit helper text */}
        <p className="text-xs text-muted-foreground text-center">
          Download the image first, then upload it as an image post for better engagement.
        </p>

        {/* Tips for Reddit (collapsible) */}
        <Collapsible open={tipsOpen} onOpenChange={setTipsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center cursor-pointer">
            <ChevronDown className={`h-3 w-3 transition-transform ${tipsOpen ? "rotate-180" : ""}`} />
            Tips for Reddit
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-3">
              <div>
                <p className="font-medium text-foreground mb-1">Best subreddits for this:</p>
                <p>r/microsaas, r/SideProject, r/Entrepreneur, r/FIRE</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">For image posts (higher engagement):</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Download the PNG above</li>
                  <li>Go to the subreddit</li>
                  <li>Create a new image post</li>
                  <li>Upload the badge image</li>
                  <li>Add context in the title or comments</li>
                </ol>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">For link posts:</p>
                <p>Use the "Share to Reddit" button above.</p>
              </div>
              <p>No personal details are on this image. Safe to post from any account.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DialogContent>
    </Dialog>
  );
}
