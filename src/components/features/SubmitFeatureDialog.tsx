import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitFeature, useSubmissionLimit, useFeatureRequests } from "@/hooks/useFeatureRequests";
import { MAX_SUBMISSIONS_PER_MONTH } from "@/lib/constants";
import type { FeatureRequest } from "@/types/features";

interface SubmitFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  email: string;
}

function SimilarRequests({
  query,
  features,
}: {
  query: string;
  features: FeatureRequest[];
}) {
  const matches = useMemo(() => {
    if (query.length < 3) return [];
    const lower = query.toLowerCase();
    return features
      .filter((f) => f.title.toLowerCase().includes(lower))
      .slice(0, 3);
  }, [query, features]);

  if (matches.length === 0) return null;

  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-2">
      <p className="text-xs text-blue-200/70 font-medium">
        Similar requests already exist. Consider upvoting instead.
      </p>
      {matches.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between text-sm text-white/80"
        >
          <span className="truncate mr-2">{m.title}</span>
          <span className="text-blue-200/50 text-xs whitespace-nowrap">
            {m.vote_count} votes
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SubmitFeatureDialog({
  open,
  onOpenChange,
  userId,
  email,
}: SubmitFeatureDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const submitMutation = useSubmitFeature(userId);
  const { data: limitData } = useSubmissionLimit(userId);
  const { data: features = [] } = useFeatureRequests();

  const currentCount = limitData?.submission_count ?? 0;
  const remaining = MAX_SUBMISSIONS_PER_MONTH - currentCount;
  const atLimit = remaining <= 0;

  const handleTitleChange = (value: string) => {
    if (value.length > 150) return;
    setTitle(value);

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => setDebouncedTitle(value), 500);
    setDebounceTimer(timer);
  };

  const handleDescriptionChange = (value: string) => {
    if (value.length > 500) return;
    setDescription(value);
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    if (atLimit) return;

    submitMutation.mutate(
      { title: title.trim(), description: description.trim(), email },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setDebouncedTitle("");
          onOpenChange(false);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle("");
      setDescription("");
      setDebouncedTitle("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#1B2A4A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Submit a Feature Request
          </DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Describe the feature you would like to see. Your request will be
            reviewed before appearing on the board.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div>
            <label
              htmlFor="feature-title"
              className="block text-sm font-medium text-blue-200 mb-1"
            >
              Title
            </label>
            <Input
              id="feature-title"
              placeholder="Short, descriptive title for your request"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30"
              maxLength={150}
            />
            <p className="text-xs text-blue-200/50 mt-1 text-right">
              {title.length}/150
            </p>
          </div>

          {/* Similar requests */}
          <SimilarRequests query={debouncedTitle} features={features} />

          {/* Description */}
          <div>
            <label
              htmlFor="feature-description"
              className="block text-sm font-medium text-blue-200 mb-1"
            >
              Description
            </label>
            <Textarea
              id="feature-description"
              placeholder="Explain the feature, what problem it solves, and how you would use it"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-blue-200/50 mt-1 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Rate limit info */}
          <p className="text-xs text-blue-200/50">
            {atLimit
              ? "You have reached the monthly limit of 30 requests. Your limit resets next month."
              : `${remaining} of ${MAX_SUBMISSIONS_PER_MONTH} submissions remaining this month.`}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !title.trim() ||
                !description.trim() ||
                atLimit ||
                submitMutation.isPending
              }
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
