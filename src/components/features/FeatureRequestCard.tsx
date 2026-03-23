import { useState } from "react";
import type { FeatureRequest } from "@/types/features";
import VoteButton from "./VoteButton";
import StatusBadge from "./StatusBadge";

interface FeatureRequestCardProps {
  feature: FeatureRequest;
  userVote: "up" | "down" | null;
  canInteract: boolean;
  onVote: (featureId: string, voteType: "up" | "down") => void;
}

export default function FeatureRequestCard({
  feature,
  userVote,
  canInteract,
  onVote,
}: FeatureRequestCardProps) {
  const [expanded, setExpanded] = useState(false);

  const descriptionIsLong = feature.description.length > 120;

  return (
    <div className="flex gap-3 sm:gap-4 rounded-xl bg-white/5 border border-white/10 p-4 transition-colors hover:bg-white/[0.07]">
      {/* Vote controls */}
      <div className="flex flex-col items-center gap-0.5 min-w-[40px]">
        <VoteButton
          direction="up"
          active={userVote === "up"}
          disabled={!canInteract}
          onClick={() => onVote(feature.id, "up")}
        />
        <span className="text-sm font-semibold text-white tabular-nums">
          {feature.vote_count}
        </span>
        <VoteButton
          direction="down"
          active={userVote === "down"}
          disabled={!canInteract}
          onClick={() => onVote(feature.id, "down")}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold text-sm sm:text-base leading-snug">
            {feature.title}
          </h3>
          <StatusBadge status={feature.status} />
        </div>

        <p className="text-blue-200/70 text-sm leading-relaxed">
          {descriptionIsLong && !expanded
            ? feature.description.slice(0, 120) + "..."
            : feature.description}
        </p>

        {descriptionIsLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[#60A5FA] text-xs mt-1 hover:underline"
          >
            {expanded ? "show less" : "show more"}
          </button>
        )}
      </div>
    </div>
  );
}
