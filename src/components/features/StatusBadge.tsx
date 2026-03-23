import type { FeatureStatus } from "@/types/features";

const STATUS_CONFIG: Record<
  FeatureStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-600",
  },
  under_review: {
    label: "Under Review",
    className: "bg-gray-100 text-[#4A5568]",
  },
  planned: {
    label: "Planned",
    className: "bg-[#60A5FA]/10 text-[#3B82F6]",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700",
  },
  shipped: {
    label: "Shipped",
    className: "bg-emerald-50 text-emerald-700",
  },
};

interface StatusBadgeProps {
  status: FeatureStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}
