import { Shield, Star, TrendingUp } from "lucide-react";

/**
 * EXPERT SECRETS: Chapter 14 — Tribal Identity Markers
 *
 * Russell: "Identity badges create belonging. People fight for the badge."
 *
 * The Invisible Builder badge is an identity marker that members can
 * share on social media, in their email signatures, or display on
 * their dashboard. It signals membership in the movement.
 *
 * Three tiers:
 *   - "Founding Builder" (first 100 members)
 *   - "Invisible Builder" (all paid members)
 *   - "Stealth Certified" (completed the Stealth Ops audit)
 *
 * Usage:
 *   <BuilderBadge tier="founding" memberName="Marcus T." freedomNumber="$3,200" />
 */

interface BuilderBadgeProps {
  tier?: "founding" | "builder" | "certified";
  memberName?: string;
  freedomNumber?: string;
  joinDate?: string;
  size?: "sm" | "md" | "lg";
}

const TIER_CONFIG = {
  founding: {
    label: "Founding Builder",
    icon: Star,
    gradient: "from-amber-500 via-amber-400 to-amber-600",
    ring: "ring-amber-400/30",
    glow: "shadow-amber-500/20",
    badge: "★ FOUNDING",
  },
  builder: {
    label: "Invisible Builder",
    icon: Shield,
    gradient: "from-primary via-primary-light to-primary-dark",
    ring: "ring-primary/30",
    glow: "shadow-primary/20",
    badge: "MEMBER",
  },
  certified: {
    label: "Stealth Certified",
    icon: TrendingUp,
    gradient: "from-emerald-500 via-emerald-400 to-emerald-600",
    ring: "ring-emerald-400/30",
    glow: "shadow-emerald-500/20",
    badge: "✓ CERTIFIED",
  },
};

const SIZE_CONFIG = {
  sm: { container: "p-3", icon: "w-4 h-4", title: "text-xs", sub: "text-[10px]", badge: "text-[8px]" },
  md: { container: "p-5", icon: "w-6 h-6", title: "text-sm", sub: "text-xs", badge: "text-[10px]" },
  lg: { container: "p-7", icon: "w-8 h-8", title: "text-base", sub: "text-sm", badge: "text-xs" },
};

export default function BuilderBadge({
  tier = "builder",
  memberName = "Anonymous Builder",
  freedomNumber,
  joinDate,
  size = "md",
}: BuilderBadgeProps) {
  const config = TIER_CONFIG[tier];
  const sizeConfig = SIZE_CONFIG[size];
  const Icon = config.icon;

  return (
    <div
      className={`relative inline-block bg-gradient-to-br ${config.gradient} rounded-2xl ${sizeConfig.container} text-white shadow-xl ${config.glow} ring-4 ${config.ring} overflow-hidden`}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />

      <div className="relative">
        {/* Badge tier */}
        <div className="flex items-center justify-between mb-3">
          <span className={`bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold tracking-wider ${sizeConfig.badge}`}>
            {config.badge}
          </span>
          <Icon className={sizeConfig.icon} />
        </div>

        {/* Member name */}
        <p className={`${sizeConfig.title} font-bold mb-1`}>{memberName}</p>

        {/* Tier label */}
        <p className={`${sizeConfig.sub} text-white/80 mb-2`}>{config.label}</p>

        {/* Stats */}
        {(freedomNumber || joinDate) && (
          <div className="border-t border-white/20 pt-2 space-y-0.5">
            {freedomNumber && (
              <div className="flex items-center justify-between">
                <span className={`${sizeConfig.badge} text-white/60 uppercase tracking-wide`}>Freedom #</span>
                <span className={`${sizeConfig.sub} font-bold`}>{freedomNumber}</span>
              </div>
            )}
            {joinDate && (
              <div className="flex items-center justify-between">
                <span className={`${sizeConfig.badge} text-white/60 uppercase tracking-wide`}>Joined</span>
                <span className={`${sizeConfig.badge} text-white/80`}>{joinDate}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 border-t border-white/20 pt-2">
          <p className={`${sizeConfig.badge} text-white/50 text-center tracking-wide`}>
            INVISIBLE EXIT MOVEMENT
          </p>
        </div>
      </div>
    </div>
  );
}
