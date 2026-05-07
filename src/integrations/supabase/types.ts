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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string
          detail: string | null
          event: string
          id: string
          severity: Database["public"]["Enums"]["severity_level"]
          target: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          detail?: string | null
          event: string
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          target?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          detail?: string | null
          event?: string
          id?: string
          severity?: Database["public"]["Enums"]["severity_level"]
          target?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ceh_progress: {
        Row: {
          completed: boolean
          id: string
          module: string
          progress: number
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          id?: string
          module: string
          progress?: number
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          id?: string
          module?: string
          progress?: number
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ceh_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          risk_score: number
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          work_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          id: string
          last_login?: string | null
          name?: string
          risk_score?: number
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          work_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          risk_score?: number
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          work_id?: string | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          approval_status: Database["public"]["Enums"]["script_approval"]
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          id: string
          language: string | null
          name: string
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["script_approval"]
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          name: string
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["script_approval"]
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          category: string | null
          code: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          progress: number
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          category?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          category?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          status: string | null
          vendor: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string | null
          vendor?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          vendor?: string | null
          version?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_work_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "operator" | "viewer"
      script_approval: "Approved" | "Pending Review" | "Rejected"
      severity_level: "Info" | "Low" | "Medium" | "High" | "Critical"
      task_priority: "Low" | "Medium" | "High" | "Critical"
      task_status:
        | "Pending"
        | "In Progress"
        | "Under Review"
        | "Completed"
        | "Blocked"
      user_status: "Active" | "Suspended" | "Pending"
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
    Enums: {
      app_role: ["super_admin", "admin", "operator", "viewer"],
      script_approval: ["Approved", "Pending Review", "Rejected"],
      severity_level: ["Info", "Low", "Medium", "High", "Critical"],
      task_priority: ["Low", "Medium", "High", "Critical"],
      task_status: [
        "Pending",
        "In Progress",
        "Under Review",
        "Completed",
        "Blocked",
      ],
      user_status: ["Active", "Suspended", "Pending"],
    },
  },
} as const
