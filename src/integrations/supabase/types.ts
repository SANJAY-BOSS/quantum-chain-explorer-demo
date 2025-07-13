export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blockchain_audit: {
        Row: {
          action_type: string
          blockchain_response: Json | null
          error_message: string | null
          hash_verified: string | null
          id: string
          record_id: string | null
          success: boolean
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          blockchain_response?: Json | null
          error_message?: string | null
          hash_verified?: string | null
          id?: string
          record_id?: string | null
          success: boolean
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          blockchain_response?: Json | null
          error_message?: string | null
          hash_verified?: string | null
          id?: string
          record_id?: string | null
          success?: boolean
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_audit_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "data_records"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_state: {
        Row: {
          chain_data: Json
          crypto_mode: string
          id: string
          is_mining: boolean | null
          last_updated: string
          pending_transactions: Json | null
          total_blocks: number | null
          total_transactions: number | null
        }
        Insert: {
          chain_data: Json
          crypto_mode?: string
          id?: string
          is_mining?: boolean | null
          last_updated?: string
          pending_transactions?: Json | null
          total_blocks?: number | null
          total_transactions?: number | null
        }
        Update: {
          chain_data?: Json
          crypto_mode?: string
          id?: string
          is_mining?: boolean | null
          last_updated?: string
          pending_transactions?: Json | null
          total_blocks?: number | null
          total_transactions?: number | null
        }
        Relationships: []
      }
      blocks: {
        Row: {
          created_at: string
          data: string
          difficulty: number
          hash: string
          id: string
          index: number
          merkle_root: string
          nonce: number
          previous_hash: string
          signature: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          data: string
          difficulty: number
          hash: string
          id: string
          index: number
          merkle_root: string
          nonce: number
          previous_hash: string
          signature: string
          timestamp: string
        }
        Update: {
          created_at?: string
          data?: string
          difficulty?: number
          hash?: string
          id?: string
          index?: number
          merkle_root?: string
          nonce?: number
          previous_hash?: string
          signature?: string
          timestamp?: string
        }
        Relationships: []
      }
      data_records: {
        Row: {
          blockchain_hash: string | null
          blockchain_verified: boolean | null
          content: string
          created_at: string
          data_hash: string
          id: string
          metadata: Json | null
          record_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          content: string
          created_at?: string
          data_hash: string
          id?: string
          metadata?: Json | null
          record_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          content?: string
          created_at?: string
          data_hash?: string
          id?: string
          metadata?: Json | null
          record_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          block_id: string | null
          created_at: string
          data: string
          hash: string
          id: string
          receiver: string
          sender: string
          signature: string
          timestamp: string
          verified: boolean
        }
        Insert: {
          amount?: number | null
          block_id?: string | null
          created_at?: string
          data: string
          hash: string
          id: string
          receiver: string
          sender: string
          signature: string
          timestamp: string
          verified?: boolean
        }
        Update: {
          amount?: number | null
          block_id?: string | null
          created_at?: string
          data?: string
          hash?: string
          id?: string
          receiver?: string
          sender?: string
          signature?: string
          timestamp?: string
          verified?: boolean
        }
        Relationships: []
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
