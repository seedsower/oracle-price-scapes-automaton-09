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
      commodity_tokens: {
        Row: {
          aerodrome_pool_address: string | null
          blockchain: string
          contract_address: string
          created_at: string
          daily_volume_usd: number | null
          decimals: number | null
          id: string
          is_active: boolean | null
          jupiter_mint_address: string | null
          liquidity_usd: number | null
          name: string
          symbol: string
          ticker: string
        }
        Insert: {
          aerodrome_pool_address?: string | null
          blockchain?: string
          contract_address: string
          created_at?: string
          daily_volume_usd?: number | null
          decimals?: number | null
          id?: string
          is_active?: boolean | null
          jupiter_mint_address?: string | null
          liquidity_usd?: number | null
          name: string
          symbol: string
          ticker: string
        }
        Update: {
          aerodrome_pool_address?: string | null
          blockchain?: string
          contract_address?: string
          created_at?: string
          daily_volume_usd?: number | null
          decimals?: number | null
          id?: string
          is_active?: boolean | null
          jupiter_mint_address?: string | null
          liquidity_usd?: number | null
          name?: string
          symbol?: string
          ticker?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          total_portfolio_value: number | null
          updated_at: string
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          total_portfolio_value?: number | null
          updated_at?: string
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          total_portfolio_value?: number | null
          updated_at?: string
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          commodity_symbol: string
          created_at: string
          id: string
          price_per_token: number
          status: string | null
          token_amount: number
          total_value: number
          transaction_hash: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          commodity_symbol: string
          created_at?: string
          id?: string
          price_per_token: number
          status?: string | null
          token_amount: number
          total_value: number
          transaction_hash?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          commodity_symbol?: string
          created_at?: string
          id?: string
          price_per_token?: number
          status?: string | null
          token_amount?: number
          total_value?: number
          transaction_hash?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_positions: {
        Row: {
          average_buy_price: number | null
          commodity_symbol: string
          created_at: string
          id: string
          token_balance: number | null
          total_invested: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_buy_price?: number | null
          commodity_symbol: string
          created_at?: string
          id?: string
          token_balance?: number | null
          total_invested?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_buy_price?: number | null
          commodity_symbol?: string
          created_at?: string
          id?: string
          token_balance?: number | null
          total_invested?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dex_trading_pairs: {
        Row: {
          aerodrome_pool_address: string | null
          base_name: string | null
          base_symbol: string | null
          base_token_id: string | null
          blockchain: string | null
          contract_address: string | null
          daily_volume_usd: number | null
          is_active: boolean | null
          jupiter_mint_address: string | null
          liquidity_usd: number | null
          pair_blockchain: string | null
          pair_contract_address: string | null
          pair_symbol: string | null
          pair_token_id: string | null
          ticker: string | null
        }
        Relationships: []
      }
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
