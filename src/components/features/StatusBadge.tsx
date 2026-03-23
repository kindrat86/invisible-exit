import type { FeatureStatus } from "@/types/features";

const STATUS_CONFIG: Record<
  FeatureStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-gray-700/50 text-gray-300",
  },
  under_review: {
    label: "Under Review",
    className: "bg-gray-600/50 text-gray-300",
  },
  planned: {
    label: "Planned",
    className: "bg-blue-800/50 text-blue-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-900/50 text-amber-300",
  },
  shipped: {
    label: "Shipped",
    className: "bg-emerald-900/50 text-emerald-300",
  },
};

interface StatusBadgeProps {
  status: FeatureStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
