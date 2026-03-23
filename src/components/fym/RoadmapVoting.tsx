import { useState } from "react";
import { Compass, ChevronUp, ChevronDown, MessageSquarePlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useRoadmapFeatures,
  useUserVotes,
  useVote,
  useSubmitFeatureRequest,
} from "@/hooks/useRoadmapVoting";

interface RoadmapVotingProps {
  userId: string;
}

export default function RoadmapVoting({ userId }: RoadmapVotingProps) {
  const { data: features = [], isLoading } = useRoadmapFeatures();
  const { data: userVotes = [] } = useUserVotes(userId);
  const voteMutation = useVote(userId);
  const submitMutation = useSubmitFeatureRequest();

  const [showForm, setShowForm] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");

  const getUserVote = (featureId: string) =>
    userVotes.find((v) => v.feature_id === featureId);

  const handleVote = (featureId: string, voteType: "up" | "down") => {
    if (voteMutation.isPending) return;
    const existingVote = getUserVote(featureId);
    voteMutation.mutate({ featureId, voteType, existingVote });
  };

  const handleSubmitRequest = () => {
    if (!requestTitle.trim() || submitMutation.isPending) return;
    submitMutation.mutate(
      { title: requestTitle.trim(), description: requestDescription.trim() },
      {
        onSuccess: () => {
          setRequestTitle("");
          setRequestDescription("");
          setShowForm(false);
        },
      }
    );
  };

  // Sort by net votes (upvotes - downvotes) descending
  const sorted = [...features].sort(
    (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 py-4">
        <div className="w-16 h-16 rounded-2xl bg-[#60A5FA]/10 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 text-[#60A5FA]" />
        </div>
        <h2 className="text-2xl font-bold text-[#0B1D3A]">Shape the Roadmap</h2>
        <p className="text-[#4A5568] max-w-lg mx-auto text-sm leading-relaxed">
          Founding Members vote on what gets built next. Your feature requests
          go to the top of the queue. You're not a user. You're a co-creator.
        </p>
      </div>

      {/* Feature list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((feature) => {
            const userVote = getUserVote(feature.id);
            const netVotes = feature.upvotes - feature.downvotes;

            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200/80 shadow-sm"
              >
                {/* Vote controls */}
                <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
                  <button
                    onClick={() => handleVote(feature.id, "up")}
                    disabled={voteMutation.isPending}
                    className={`p-1 rounded-md transition-colors ${
                      userVote?.vote_type === "up"
                        ? "text-[#60A5FA] bg-[#60A5FA]/10"
                        : "text-[#8A95A8] hover:text-[#60A5FA] hover:bg-[#60A5FA]/5"
                    }`}
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      netVotes > 0
                        ? "text-[#60A5FA]"
                        : netVotes < 0
                        ? "text-red-400"
                        : "text-[#8A95A8]"
                    }`}
                  >
                    {netVotes}
                  </span>
                  <button
                    onClick={() => handleVote(feature.id, "down")}
                    disabled={voteMutation.isPending}
                    className={`p-1 rounded-md transition-colors ${
                      userVote?.vote_type === "down"
                        ? "text-red-400 bg-red-50"
                        : "text-[#8A95A8] hover:text-red-400 hover:bg-red-50"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Feature info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0B1D3A] font-semibold text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-[#4A5568] text-xs mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Feature Request */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full p-4 rounded-xl border border-dashed border-[#60A5FA]/30 bg-[#60A5FA]/5 text-center hover:bg-[#60A5FA]/10 hover:border-[#60A5FA]/50 transition-colors group"
        >
          <MessageSquarePlus className="w-6 h-6 text-[#60A5FA] mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-[#60A5FA] text-sm font-semibold">
            Submit Your Feature Request
          </p>
          <p className="text-[#8A95A8] text-xs mt-1">
            Tell us what you need — we'll prioritize it
          </p>
        </button>
      ) : (
        <div className="p-5 rounded-xl bg-white border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquarePlus className="w-5 h-5 text-[#60A5FA]" />
            <h3 className="text-[#0B1D3A] font-semibold text-sm">
              Submit a Feature Request
            </h3>
          </div>

          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Feature Title
            </label>
            <input
              type="text"
              value={requestTitle}
              onChange={(e) => setRequestTitle(e.target.value)}
              placeholder="e.g. Auto-import revenue from Stripe"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#0B1D3A] placeholder:text-[#8A95A8] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/30 focus:border-[#60A5FA]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#4A5568] mb-1 block">
              Description (optional)
            </label>
            <textarea
              value={requestDescription}
              onChange={(e) => setRequestDescription(e.target.value)}
              placeholder="What problem would this solve for you?"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-[#0B1D3A] placeholder:text-[#8A95A8] focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/30 focus:border-[#60A5FA] resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmitRequest}
              disabled={!requestTitle.trim() || submitMutation.isPending}
              className="bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm font-semibold"
            >
              <Send className="w-4 h-4 mr-1.5" />
              {submitMutation.isPending ? "Sending..." : "Submit Request"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setRequestTitle("");
                setRequestDescription("");
              }}
              className="text-[#8A95A8] text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
