import { Crown } from "lucide-react";

interface FoundingBadgeProps {
  compact?: boolean;
}

export default function FoundingBadge({ compact = false }: FoundingBadgeProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-2 py-0.5 text-xs font-medium text-[#60A5FA]">
        <Crown className="h-3 w-3" />
        <span className="hidden sm:inline">Founder</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-3 py-1 text-sm font-medium text-[#60A5FA]">
      <Crown className="h-4 w-4" />
      Founding Member
    </span>
  );
}
