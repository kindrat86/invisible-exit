import { useMemo } from "react";
import { format } from "date-fns";
import type { FymEntry, InvisibilityScore, MorningBriefingData } from "@/types/fym";
import { evaluateFreedomLevel } from "@/lib/fym-calculations";

export function useMorningBriefing(
  entries: FymEntry[],
  latestEntry: FymEntry | null | undefined,
  invisibilityScore: InvisibilityScore | null | undefined
): MorningBriefingData | null {
  return useMemo(() => {
    if (!latestEntry || entries.length === 0) return null;

    const today = format(new Date(), "MMMM d, yyyy");

    const fymGap =
      Number(latestEntry.monthly_revenue) - Number(latestEntry.monthly_burn);

    const currentInputs = {
      monthsToExit: latestEntry.runway_months,
      monthlyExpenses: Number(latestEntry.monthly_burn),
      monthlySideRevenue: Number(latestEntry.monthly_revenue),
      monthlyGrowthRate: Number(latestEntry.monthly_growth_rate) || 15,
      corporateSalary: Number(latestEntry.corporate_salary) || 120000,
      targetMonthlyRevenue: Number(latestEntry.target_monthly_revenue) || 4000,
    };

    const currentLevel = evaluateFreedomLevel(currentInputs);

    // Calculate streak (consecutive days with entries, working backward from today)
    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let streak = 0;
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].created_at);
      const entryDay = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate()
      );
      const expectedDay = new Date(todayDate);
      expectedDay.setDate(expectedDay.getDate() - i);

      if (entryDay.getTime() === expectedDay.getTime()) {
        streak++;
      } else if (i === 0 && entryDay.getTime() === todayDate.getTime() - 86400000) {
        // Allow yesterday if no entry today
        streak++;
      } else {
        break;
      }
    }

    // Revenue change: first entry vs latest
    const firstEntry = entries[0];
    const revenueChange = {
      from: Number(firstEntry.monthly_revenue),
      to: Number(latestEntry.monthly_revenue),
    };

    // Level change
    const firstInputs = {
      monthsToExit: firstEntry.runway_months,
      monthlyExpenses: Number(firstEntry.monthly_burn),
      monthlySideRevenue: Number(firstEntry.monthly_revenue),
      monthlyGrowthRate: Number(firstEntry.monthly_growth_rate) || 15,
      corporateSalary: Number(firstEntry.corporate_salary) || 120000,
      targetMonthlyRevenue: Number(firstEntry.target_monthly_revenue) || 4000,
    };
    const firstLevel = evaluateFreedomLevel(firstInputs);

    const levelChange = { from: firstLevel, to: currentLevel };
    const daysTracked = entries.length;

    // Today's focus logic
    let todaysFocus: string;
    let focusEstimate: string;

    const invScore = invisibilityScore?.total_score ?? null;

    if (invScore === null) {
      todaysFocus =
        "Complete your Invisibility audit — find out if your employer could discover your side business. This matters as much as your revenue.";
      focusEstimate = "8 minutes";
    } else if (invScore < 50) {
      todaysFocus = `Your operation is only ${invScore}/100 hidden — your employer could still find you. Review the Invisibility fixes tab.`;
      focusEstimate = "5 minutes";
    } else {
      // Check if entry saved today
      const hasTodayEntry = sortedEntries.some((e) => {
        const d = new Date(e.created_at);
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth() &&
          d.getDate() === now.getDate()
        );
      });

      if (!hasTodayEntry) {
        todaysFocus =
          "You haven't logged today yet. Save your numbers to keep your streak alive.";
        focusEstimate = "30 seconds";
      } else if (Number(latestEntry.monthly_revenue) === 0) {
        todaysFocus =
          "You're at $0 revenue. Head to the Idea Directory and pick your first side project to start building.";
        focusEstimate = "10 minutes";
      } else {
        // Check for stalled growth (last 3 entries same revenue)
        const lastThree = sortedEntries.slice(0, 3);
        const allSameRevenue =
          lastThree.length >= 3 &&
          lastThree.every(
            (e) =>
              Number(e.monthly_revenue) ===
              Number(lastThree[0].monthly_revenue)
          );

        if (allSameRevenue) {
          todaysFocus =
            "Your revenue hasn't moved for 3 entries in a row. Time to shake things up — try a different price, reach a new audience, or launch a second product.";
          focusEstimate = "15 minutes";
        } else {
          todaysFocus =
            "You're on track. Keep building. Come back tomorrow morning before your first meeting.";
          focusEstimate = "";
        }
      }
    }

    return {
      date: today,
      fymGap,
      currentLevel,
      streak,
      revenueChange,
      levelChange,
      daysTracked,
      todaysFocus,
      focusEstimate,
    };
  }, [entries, latestEntry, invisibilityScore]);
}
