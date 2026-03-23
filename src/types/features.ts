export type FeatureStatus =
  | "pending"
  | "under_review"
  | "planned"
  | "in_progress"
  | "shipped";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  vote_count: number;
  submitted_by: string | null;
  submitted_email: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureVote {
  id: string;
  feature_id: string;
  user_id: string;
  vote_type: "up" | "down";
  created_at: string;
}

export interface FeatureRequestLimit {
  id: string;
  user_id: string;
  month_year: string;
  submission_count: number;
}

export interface VoteResult {
  action: "added" | "removed" | "changed";
  vote_type: "up" | "down" | null;
  new_count: number;
}
