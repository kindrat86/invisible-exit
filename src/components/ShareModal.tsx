import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, ExternalLink } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  freedomNumber: string;
  shareUrl: string;
}

export default function ShareModal({
  open,
  onOpenChange,
  freedomNumber,
  shareUrl,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(
      `My freedom number: ${freedomNumber}. What's yours? ${shareUrl}`
    );
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0B1D3A",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "my-fym-score.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // html2canvas not installed - fallback to copy
      await copyText();
    }
    setDownloading(false);
  };

  const handleReddit = () => {
    const title = encodeURIComponent(
      `My Freedom Number is ${freedomNumber}. What's yours?`
    );
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your Number</DialogTitle>
        </DialogHeader>

        {/* Shareable card (used for image capture) */}
        <div
          ref={cardRef}
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: "#0B1D3A" }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            My FYM Score
          </p>
          <p className="text-5xl font-bold text-[#60A5FA] mb-2">
            {freedomNumber}
          </p>
          <p className="text-gray-400 text-sm">Freedom Number</p>
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-gray-500 text-xs">
              Built with invisibleexit.com/fym
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={copyLink} className="w-full">
            {copiedLink ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </>
            )}
          </Button>
          <Button variant="outline" onClick={copyText} className="w-full">
            {copiedText ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" /> Copy Text
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "Generating..." : "Download Image"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReddit}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Share to Reddit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
