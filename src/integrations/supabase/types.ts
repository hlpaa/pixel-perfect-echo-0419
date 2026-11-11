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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          id: string
          neighborhood: string
          number: string
          postal_code: string
          state: string
          street: string
          user_id: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          id?: string
          neighborhood: string
          number: string
          postal_code: string
          state: string
          street: string
          user_id: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          id?: string
          neighborhood?: string
          number?: string
          postal_code?: string
          state?: string
          street?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          company_name: string
          contact_info: string | null
          default_reminder_days: number
          id: number
          operational_notes: string | null
          service_region: string | null
          support_phone: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          company_name?: string
          contact_info?: string | null
          default_reminder_days?: number
          id?: number
          operational_notes?: string | null
          service_region?: string | null
          support_phone?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_info?: string | null
          default_reminder_days?: number
          id?: number
          operational_notes?: string | null
          service_region?: string | null
          support_phone?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          subtotal: number | null
          unit_price: number | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          subtotal?: number | null
          unit_price?: number | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          subtotal?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          customer_notes: string | null
          estimated_delivery_date: string | null
          id: string
          internal_notes: string | null
          order_number: number
          pet_id: string | null
          plan_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          customer_notes?: string | null
          estimated_delivery_date?: string | null
          id?: string
          internal_notes?: string | null
          order_number?: number
          pet_id?: string | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          customer_notes?: string | null
          estimated_delivery_date?: string | null
          id?: string
          internal_notes?: string | null
          order_number?: number
          pet_id?: string | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "replenishment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_foods: {
        Row: {
          brand: string | null
          created_at: string
          daily_consumption_grams: number | null
          estimated_end_date: string | null
          food_name: string
          food_type: string | null
          id: string
          manual_end_date: string | null
          package_opened_at: string
          package_weight_grams: number
          pet_id: string
          product_id: string | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          daily_consumption_grams?: number | null
          estimated_end_date?: string | null
          food_name: string
          food_type?: string | null
          id?: string
          manual_end_date?: string | null
          package_opened_at?: string
          package_weight_grams: number
          pet_id: string
          product_id?: string | null
          user_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          daily_consumption_grams?: number | null
          estimated_end_date?: string | null
          food_name?: string
          food_type?: string | null
          id?: string
          manual_end_date?: string | null
          package_opened_at?: string
          package_weight_grams?: number
          pet_id?: string
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_foods_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_foods_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age_years: number | null
          breed: string | null
          created_at: string
          id: string
          name: string
          species: Database["public"]["Enums"]["species"]
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age_years?: number | null
          breed?: string | null
          created_at?: string
          id?: string
          name: string
          species: Database["public"]["Enums"]["species"]
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age_years?: number | null
          breed?: string | null
          created_at?: string
          id?: string
          name?: string
          species?: Database["public"]["Enums"]["species"]
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          available: boolean
          brand: string
          created_at: string
          food_type: string | null
          id: string
          is_demo: boolean
          name: string
          package_weight_kg: number
          price: number | null
          species: Database["public"]["Enums"]["species"] | null
        }
        Insert: {
          active?: boolean
          available?: boolean
          brand: string
          created_at?: string
          food_type?: string | null
          id?: string
          is_demo?: boolean
          name: string
          package_weight_kg: number
          price?: number | null
          species?: Database["public"]["Enums"]["species"] | null
        }
        Update: {
          active?: boolean
          available?: boolean
          brand?: string
          created_at?: string
          food_type?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          package_weight_kg?: number
          price?: number | null
          species?: Database["public"]["Enums"]["species"] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          onboarding_completed: boolean
          phone: string | null
          reminder_days_before: number
          replenishment_frequency_days: number | null
          replenishment_mode: string
          status: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          onboarding_completed?: boolean
          phone?: string | null
          reminder_days_before?: number
          replenishment_frequency_days?: number | null
          replenishment_mode?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          onboarding_completed?: boolean
          phone?: string | null
          reminder_days_before?: number
          replenishment_frequency_days?: number | null
          replenishment_mode?: string
          status?: string
        }
        Relationships: []
      }
      replenishment_plans: {
        Row: {
          created_at: string
          frequency_days: number
          id: string
          next_replenishment_date: string
          pet_food_id: string | null
          pet_id: string
          product_id: string | null
          quantity: number
          reminder_days_before: number
          status: Database["public"]["Enums"]["plan_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency_days: number
          id?: string
          next_replenishment_date: string
          pet_food_id?: string | null
          pet_id: string
          product_id?: string | null
          quantity?: number
          reminder_days_before?: number
          status?: Database["public"]["Enums"]["plan_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          frequency_days?: number
          id?: string
          next_replenishment_date?: string
          pet_food_id?: string | null
          pet_id?: string
          product_id?: string | null
          quantity?: number
          reminder_days_before?: number
          status?: Database["public"]["Enums"]["plan_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replenishment_plans_pet_food_id_fkey"
            columns: ["pet_food_id"]
            isOneToOne: false
            referencedRelation: "pet_foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replenishment_plans_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replenishment_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      create_order: {
        Args: {
          _address_id: string
          _notes?: string
          _pet_id: string
          _plan_id?: string
          _product_id: string
          _quantity: number
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      order_status_label: {
        Args: { s: Database["public"]["Enums"]["order_status"] }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "user"
      order_status:
        | "aguardando_confirmacao"
        | "confirmado"
        | "em_preparacao"
        | "saiu_para_entrega"
        | "entregue"
        | "cancelado"
      plan_status: "ativo" | "pausado" | "cancelado"
      species: "cachorro" | "gato"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
      order_status: [
        "aguardando_confirmacao",
        "confirmado",
        "em_preparacao",
        "saiu_para_entrega",
        "entregue",
        "cancelado",
      ],
      plan_status: ["ativo", "pausado", "cancelado"],
      species: ["cachorro", "gato"],
    },
  },
} as const
