import type { SubscriptionTier } from "./AuthProvider";

/**
 * Map each tool / feature to the minimum tier required.
 * "free" = everyone, "starter" = starter+, "pro" = pro only.
 */
export const TOOL_TIERS: Record<string, SubscriptionTier> = {
    "fym-calculator": "free",
    "invisibility-scanner": "free",
    "idea-pipeline": "starter",
    "stealth-ops": "starter",
    "launch-control": "pro",
    "brand-manager": "pro",
};

const TIER_RANK: Record<SubscriptionTier, number> = {
    free: 0,
    starter: 1,
    pro: 2,
};

/**
 * Returns true if the user's subscription tier meets or exceeds the
 * required tier for the given tool.
 */
export function hasAccess(
    userTier: SubscriptionTier,
    toolKey: string,
  ): boolean {
    const requiredTier = TOOL_TIERS[toolKey] ?? "pro";
    return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}
