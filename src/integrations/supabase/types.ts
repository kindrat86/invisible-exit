export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          stripe_customer_id: string | null
          subscription_status: string
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          stripe_customer_id?: string | null
          subscription_status?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fym_entries: {
        Row: {
          id: string
          user_id: string
          runway_months: number
          monthly_burn: number
          monthly_revenue: number
          fym_monthly: number
          fym_total: number
          fym_freedom_number: number
          monthly_growth_rate: number
          corporate_salary: number
          target_monthly_revenue: number
          freedom_level: number
          combined_readiness_score: number
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          runway_months: number
          monthly_burn: number
          monthly_revenue: number
          fym_monthly: number
          fym_total: number
          fym_freedom_number: number
          monthly_growth_rate?: number
          corporate_salary?: number
          target_monthly_revenue?: number
          freedom_level?: number
          combined_readiness_score?: number
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          runway_months?: number
          monthly_burn?: number
          monthly_revenue?: number
          fym_monthly?: number
          fym_total?: number
          fym_freedom_number?: number
          monthly_growth_rate?: number
          corporate_salary?: number
          target_monthly_revenue?: number
          freedom_level?: number
          combined_readiness_score?: number
          created_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fym_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      fym_scenarios: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          name: string
          starting_revenue: number
          monthly_growth_rate: number
          monthly_expenses: number
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          name?: string
          starting_revenue?: number
          monthly_growth_rate?: number
          monthly_expenses?: number
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          name?: string
          starting_revenue?: number
          monthly_growth_rate?: number
          monthly_expenses?: number
          is_active?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "fym_scenarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      invisibility_scores: {
        Row: {
          id: string
          user_id: string
          total_score: number
          entity_score: number
          digital_score: number
          compliance_score: number
          operational_score: number
          financial_score: number
          answers: Record<string, boolean>
          fixes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_score: number
          entity_score?: number
          digital_score?: number
          compliance_score?: number
          operational_score?: number
          financial_score?: number
          answers?: Record<string, boolean>
          fixes_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_score?: number
          entity_score?: number
          digital_score?: number
          compliance_score?: number
          operational_score?: number
          financial_score?: number
          answers?: Record<string, boolean>
          fixes_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invisibility_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      idea_pipeline: {
        Row: {
          id: string
          user_id: string
          created_at: string
          idea_name: string
          idea_description: string
          source_idea_id: string | null
          total_score: number
          market_score: number
          revenue_score: number
          build_score: number
          invisibility_score: number
          moat_score: number
          verdict: string
          answers: Record<string, boolean>
          action_plan_checked: Record<string, boolean>
          strengths: string[]
          red_flags: string[]
          decision_nodes: Array<{ label: string; passed: boolean; reason: string }>
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          idea_name: string
          idea_description: string
          source_idea_id?: string | null
          total_score: number
          market_score?: number
          revenue_score?: number
          build_score?: number
          invisibility_score?: number
          moat_score?: number
          verdict: string
          answers?: Record<string, boolean>
          action_plan_checked?: Record<string, boolean>
          strengths?: string[]
          red_flags?: string[]
          decision_nodes?: Array<{ label: string; passed: boolean; reason: string }>
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          idea_name?: string
          idea_description?: string
          source_idea_id?: string | null
          total_score?: number
          market_score?: number
          revenue_score?: number
          build_score?: number
          invisibility_score?: number
          moat_score?: number
          verdict?: string
          answers?: Record<string, boolean>
          action_plan_checked?: Record<string, boolean>
          strengths?: string[]
          red_flags?: string[]
          decision_nodes?: Array<{ label: string; passed: boolean; reason: string }>
        }
        Relationships: [
          {
            foreignKeyName: "idea_pipeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      fym_badges: {
        Row: {
          id: string
          user_id: string
          badge_value: number
          share_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_value: number
          share_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_value?: number
          share_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fym_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
