import { Lock } from "lucide-react";

interface FeatureGateProps {
  /** Is the user on a full-access tier (founding or standard)? */
  hasFullAccess: boolean;
  /** What to show when the feature is locked */
  lockedMessage?: string;
  children: React.ReactNode;
}

/**
 * Wraps a feature that requires full access.
 * - If hasFullAccess=true: renders children normally
 * - If hasFullAccess=false: renders children with a lock overlay
 */
export default function FeatureGate({ hasFullAccess, lockedMessage, children }: FeatureGateProps) {
  if (hasFullAccess) return <>{children}</>;

  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-xl">
        <div className="text-center p-6">
          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-sm">
            {lockedMessage || "Upgrade to Full Toolkit to unlock this feature"}
          </p>
        </div>
      </div>
    </div>
  );
}
