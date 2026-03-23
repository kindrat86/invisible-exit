import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteButtonProps {
  direction: "up" | "down";
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function VoteButton({
  direction,
  active,
  disabled,
  onClick,
}: VoteButtonProps) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;

  const activeColor =
    direction === "up" ? "text-[#60A5FA]" : "text-red-500";
  const inactiveColor = "text-[#9CA3AF]";
  const hoverColor = disabled
    ? ""
    : direction === "up"
      ? "hover:text-[#60A5FA]"
      : "hover:text-red-500";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex items-center justify-center w-8 h-8 rounded-md transition-colors
        ${active ? activeColor : inactiveColor}
        ${hoverColor}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
      `}
      aria-label={`Vote ${direction}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
