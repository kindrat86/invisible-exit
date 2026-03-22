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

// ── Idea Pipeline types ──

export type PipelineCategoryKey = "market" | "revenue" | "build" | "invisibility" | "moat";

export interface PipelineQuestion {
  id: string;
  category: PipelineCategoryKey;
  categoryLabel: string;
  text: string;
  hint: string;
  yesScore: number;
  impact: "Critical" | "Important" | "Nice-to-have";
  positiveImplication: string;
  negativeImplication: string;
}

export interface PipelineCategory {
  key: PipelineCategoryKey;
  label: string;
  maxScore: number;
}

export type PipelineVerdict = "GO" | "CONDITIONAL_GO" | "NO_GO";

export interface ActionPlanTask {
  id: string;
  phase: "hour_0_8" | "hour_8_24" | "hour_24_40" | "hour_40_48";
  phaseLabel: string;
  text: string;
  category: PipelineCategoryKey;
}

export interface DecisionNode {
  label: string;
  passed: boolean;
  reason: string;
}

export interface PipelineEntry {
  id: string;
  user_id: string;
  created_at: string;
  idea_name: string;
  idea_description: string;
  source_idea_id: string | null;
  total_score: number;
  market_score: number;
  revenue_score: number;
  build_score: number;
  invisibility_score: number;
  moat_score: number;
  verdict: PipelineVerdict;
  answers: Record<string, boolean>;
  action_plan_checked: Record<string, boolean>;
  strengths: string[];
  red_flags: string[];
  decision_nodes: DecisionNode[];
}

// ── Brand Manager types ──

export type BrandPhaseId = "positioning" | "visual-identity" | "website" | "voice" | "organic-presence";

export interface BrandTask {
  id: string;
  phaseId: BrandPhaseId;
  title: string;
  description: string;
  type: "checkbox" | "fill-in" | "choice" | "template";
  prompt?: string;
  placeholder?: string;
  options?: string[];
  templateContent?: string;
  weight: number;
  hint?: string;
}

export interface BrandPhase {
  id: BrandPhaseId;
  title: string;
  subtitle: string;
  icon: string;
  tasks: BrandTask[];
  maxScore: number;
}

export interface BrandTaskCompletion {
  completed: boolean;
  textValue?: string;
  selectedOption?: string;
  updatedAt: string;
}

export interface BrandManagerState {
  taskCompletions: Record<string, BrandTaskCompletion>;
  currentPhaseIndex: number;
  startedAt: string;
  lastUpdatedAt: string;
}

// ── Launch Control ──

export interface LaunchTask {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  tip: string;
  sortOrder: number;
}

export interface LaunchPhase {
  id: string;
  name: string;
  tagline: string;
  description: string;
  sortOrder: number;
  tasks: LaunchTask[];
  completionCopy: string;
}

export interface LaunchProgress {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  selected_idea_id: string | null;
  selected_idea_title: string | null;
  completed_tasks: Record<string, boolean>;
  notes: Record<string, string>;
  started_at: string;
  completed_at: string | null;
}
