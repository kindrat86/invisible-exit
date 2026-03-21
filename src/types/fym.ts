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
  yesScore: number;
  fixTitle: string;
  fixDescription: string;
  priority: "High" | "Medium" | "Low";
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
