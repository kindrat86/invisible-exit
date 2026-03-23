import { useState } from "react";
import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeatureRequests, useUserVotes, useVote } from "@/hooks/useFeatureRequests";
import FeatureRequestCard from "./FeatureRequestCard";
import SubmitFeatureDialog from "./SubmitFeatureDialog";

interface FeatureRequestBoardProps {
  userId: string;
  email: string;
  hasFullAccess: boolean;
  isStarter: boolean;
}

export default function FeatureRequestBoard({
  userId,
  email,
  hasFullAccess,
  isStarter,
}: FeatureRequestBoardProps) {
  const [submitOpen, setSubmitOpen] = useState(false);

  const { data: features, isLoading } = useFeatureRequests();
  const { data: votesMap } = useUserVotes(userId);
  const voteMutation = useVote(userId);

  const canInteract = hasFullAccess;

  const handleVote = (featureId: string, voteType: "up" | "down") => {
    if (!canInteract) return;
    voteMutation.mutate({ featureId, voteType });
  };

  return (
    <div className="space-y-6">
      {/* Starter upgrade banner */}
      {isStarter && (
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-blue-200/80">
            Feature voting and submissions are available for Founding Members.
          </p>
          <Link to="/oto/founding">
            <Button
              size="sm"
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold whitespace-nowrap"
            >
              Upgrade to Founding Member
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#60A5FA]" />
          <h2 className="text-lg font-bold text-white">Feature Requests</h2>
        </div>

        {canInteract ? (
          <Button
            onClick={() => setSubmitOpen(true)}
            className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white font-semibold"
          >
            Request a Feature
          </Button>
        ) : isStarter ? (
          <Link to="/oto/founding">
            <Button
              variant="outline"
              className="border-white/10 text-blue-200 hover:bg-white/5 hover:text-white"
            >
              Upgrade to Submit
            </Button>
          </Link>
        ) : null}
      </div>

      {/* Feature list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white/5 border border-white/10 p-4 flex gap-4"
            >
              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                <Skeleton className="w-6 h-6 bg-white/10" />
                <Skeleton className="w-8 h-4 bg-white/10" />
                <Skeleton className="w-6 h-6 bg-white/10" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      ) : !features || features.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
          <Lightbulb className="w-10 h-10 text-blue-200/30 mx-auto mb-3" />
          <p className="text-blue-200/70 text-sm">
            No feature requests yet. Be the first to submit one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <FeatureRequestCard
              key={feature.id}
              feature={feature}
              userVote={votesMap?.get(feature.id) ?? null}
              canInteract={canInteract}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {/* Submit dialog */}
      {canInteract && (
        <SubmitFeatureDialog
          open={submitOpen}
          onOpenChange={setSubmitOpen}
          userId={userId}
          email={email}
        />
      )}
    </div>
  );
}
