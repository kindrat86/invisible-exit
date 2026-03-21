export interface FymEntry {
  id: string;
  user_id: string;
  runway_months: number;
  monthly_burn: number;
  monthly_revenue: number;
  fym_monthly: number;
  fym_total: number;
  fym_freedom_number: number;
  created_at: string;
  deleted_at: string | null;
  monthly_growth_rate: number | null;
  corporate_salary: number | null;
  target_monthly_revenue: number | null;
  freedom_level: number | null;
  combined_readiness_score: number | null;
}

export interface CalculatorInputs {
  runwayMonths: number;
  monthlyBurn: number;
  monthlyRevenue: number;
}

export interface CalculatorResults {
  fymMonthly: number;
  fymTotal: number;
  freedomNumber: number;
  freedomPercentage: number;
  runwayProjection: number;
}

export interface InvisibilityScore {
  id: string;
  user_id: string;
  created_at: string;
  total_score: number;
  entity_score: number;
  digital_score: number;
  compliance_score: number;
  operational_score: number;
  financial_score: number;
  answers: Record<string, boolean>;
  fixes_count: number;
}

export interface InvisibilityQuestion {
  id: string;
  category: "entity" | "digital" | "compliance" | "operational" | "financial";
  categoryLabel: string;
  text: string;
  hint: string;
  yesScore: number;
  fixTitle: string;
  fixDescription: string;
  priority: "High" | "Medium" | "Low";
}

// Expanded calculator inputs for the mega-upgrade
export interface CalculatorInputsExpanded {
  monthsToExit: number;
  monthlyExpenses: number;
  monthlySideRevenue: number;
  monthlyGrowthRate: number;
  corporateSalary: number;
  targetMonthlyRevenue: number;
}

export interface FreedomLevelDef {
  level: number;
  name: string;
  description: string;
  motivationalCopy: string;
}

export interface FymScenario {
  id: string;
  name: string;
  startingRevenue: number;
  monthlyGrowthRate: number;
  monthlyExpenses: number;
  isCurrentPath: boolean;
  // Computed
  monthsToTarget: number | null;
  monthsToLevel4: number | null;
  projectedRevenueAtExit: number;
  totalProjectedEarnings: number;
  monthlyProjections: number[];
}

export interface FymScenarioRow {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  starting_revenue: number;
  monthly_growth_rate: number;
  monthly_expenses: number;
  is_active: boolean;
  sort_order: number;
}

export interface MorningBriefingData {
  date: string;
  fymGap: number;
  currentLevel: number;
  streak: number;
  revenueChange: { from: number; to: number };
  levelChange: { from: number; to: number };
  daysTracked: number;
  todaysFocus: string;
  focusEstimate: string;
}

export interface ReverseCalcResult {
  requiredGrowthRate: number;
  milestones: Array<{
    month: number;
    revenue: number;
    delta: number;
    approxNewCustomers: number;
  }>;
  realityCheckZone:
    | "very_achievable"
    | "within_average"
    | "ambitious"
    | "very_aggressive"
    | "unrealistic";
  recommendation: string;
}

export interface RiskAssessment {
  financialScore: number;
  invisibilityScore: number | null;
  combinedScore: number | null;
  riskRewardRatio: number;
  riskContext: string;
}

export interface IdeaEntry {
  id: string;
  title: string;
  description: string;
  industry: string;
  revenue_tier: string;
  time_investment: string;
  invisibility_score: number;
  technical_difficulty: string;
  startup_cost: string;
  example_tools: string;
  monetization_model: string;
  validation_method: string;
  tags: string[];
  is_featured: boolean;
}
