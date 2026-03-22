export type LegalTemplateCategory =
  | "Entity Formation"
  | "Contracts & Agreements"
  | "IP Protection"
  | "Privacy & NDAs"
  | "Tax & Compliance";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface LegalTemplate {
  id: string;
  title: string;
  description: string;
  category: LegalTemplateCategory;
  risk_level: RiskLevel;
  estimated_cost: string;
  time_to_complete: string;
  when_you_need_it: string;
  template_content: string;
  checklist: string[];
}

export type PlaybookDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type PlaybookCategory =
  | "Digital Identity"
  | "Entity Setup"
  | "Financial Separation"
  | "Communication"
  | "Operational Security";

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  estimated_time: string;
  tools?: string[];
  cost?: string;
  tip?: string;
}

export interface PlaybookMission {
  id: string;
  title: string;
  description: string;
  difficulty: PlaybookDifficulty;
  estimated_time: string;
  category: PlaybookCategory;
  tools_needed: string[];
  cost_estimate: string;
  steps: PlaybookStep[];
}

export interface ComplianceEntry {
  id: string;
  clause_type: string;
  description: string;
  risk_level: RiskLevel;
  common_in: string[];
  what_it_means: string;
  what_to_do: string;
  jurisdiction_notes: string;
  example_language: string;
}

export function getRiskBadgeClasses(level: RiskLevel): string {
  switch (level) {
    case "Low":
      return "bg-green-100 text-green-800";
    case "Medium":
      return "bg-yellow-100 text-yellow-800";
    case "High":
      return "bg-red-100 text-red-800";
    case "Critical":
      return "bg-purple-100 text-purple-800";
  }
}
