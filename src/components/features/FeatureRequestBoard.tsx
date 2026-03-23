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
        <div className="rounded-xl bg-[#60A5FA]/5 border border-[#60A5FA]/15 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-[#4A5568]">
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#60A5FA]/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#60A5FA]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0B1D3A]">Roadmap</h2>
            <p className="text-sm text-[#4A5568]">
              Vote on what gets built next
            </p>
          </div>
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
              className="border-gray-200 text-[#4A5568] hover:bg-gray-50 hover:text-[#0B1D3A]"
            >
              Upgrade to Submit
            </Button>
          </Link>
        ) : null}
      </div>

      {/* Feature list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-gray-200 p-4 flex gap-4"
            >
              <div className="flex flex-col items-center gap-1 min-w-[40px]">
                <Skeleton className="w-6 h-6" />
                <Skeleton className="w-8 h-4" />
                <Skeleton className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !features || features.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white border border-gray-200">
          <Lightbulb className="w-10 h-10 text-[#9CA3AF] mx-auto mb-3" />
          <p className="text-[#4A5568] text-sm">
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
