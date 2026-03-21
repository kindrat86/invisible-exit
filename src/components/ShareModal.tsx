import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share Your Number</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <p className="text-4xl font-bold text-[#D4A843] mb-2">
            {freedomNumber}
          </p>
          <p className="text-[#8A95A8] text-sm">What's yours?</p>
        </div>
        <div className="flex flex-col gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
