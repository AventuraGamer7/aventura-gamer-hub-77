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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: number | null
          created_at: string
          description: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          xp_reward: number
        }
        Insert: {
          condition_type: string
          condition_value?: number | null
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          xp_reward: number
        }
        Update: {
          condition_type?: string
          condition_value?: number | null
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          xp_reward?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          content: string | null
          cover: string | null
          created_at: string
          curriculum: Json | null
          description: string | null
          duration_weeks: number | null
          estimated_students: number | null
          has_certification: boolean | null
          id: string
          includes: Json | null
          learning_outcomes: Json | null
          level: string | null
          price: number
          requirements: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover?: string | null
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          duration_weeks?: number | null
          estimated_students?: number | null
          has_certification?: boolean | null
          id?: string
          includes?: Json | null
          learning_outcomes?: Json | null
          level?: string | null
          price: number
          requirements?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover?: string | null
          created_at?: string
          curriculum?: Json | null
          description?: string | null
          duration_weeks?: number | null
          estimated_students?: number | null
          has_certification?: boolean | null
          id?: string
          includes?: Json | null
          learning_outcomes?: Json | null
          level?: string | null
          price?: number
          requirements?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gamification_rules: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          rule_name: string
          rule_type: string
          threshold_value: number | null
          updated_at: string
          xp_amount: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          rule_name: string
          rule_type: string
          threshold_value?: number | null
          updated_at?: string
          xp_amount: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          rule_name?: string
          rule_type?: string
          threshold_value?: number | null
          updated_at?: string
          xp_amount?: number
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          button_text: string
          button_url: string
          created_at: string | null
          description: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text: string
          button_url: string
          created_at?: string | null
          description: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          subtitle: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string
          button_url?: string
          created_at?: string | null
          description?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      manual_orders: {
        Row: {
          created_at: string
          description: string
          id: string
          payment_method: string
          receipt_url: string | null
          status: string
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          payment_method?: string
          receipt_url?: string | null
          status?: string
          total_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          payment_method?: string
          receipt_url?: string | null
          status?: string
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ordenes_servicio: {
        Row: {
          admin_descripcion: string | null
          admin_imagenes: string[] | null
          created_at: string
          descripcion: string
          estado: string
          id: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          admin_descripcion?: string | null
          admin_imagenes?: string[] | null
          created_at?: string
          descripcion: string
          estado?: string
          id?: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          admin_descripcion?: string | null
          admin_imagenes?: string[] | null
          created_at?: string
          descripcion?: string
          estado?: string
          id?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivered_at: string | null
          estimated_delivery: string | null
          id: string
          item_id: string
          item_type: string
          quantity: number
          shipped_at: string | null
          shipping_address: string | null
          shipping_status:
            | Database["public"]["Enums"]["shipping_status_enum"]
            | null
          total_price: number
          tracking_number: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          item_id: string
          item_type: string
          quantity?: number
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_status?:
            | Database["public"]["Enums"]["shipping_status_enum"]
            | null
          total_price: number
          tracking_number?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_status?:
            | Database["public"]["Enums"]["shipping_status_enum"]
            | null
          total_price?: number
          tracking_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color_code: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean
          name: string
          price_adjustment: number | null
          product_id: string
          stock: number
          updated_at: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean
          name: string
          price_adjustment?: number | null
          product_id: string
          stock?: number
          updated_at?: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          price_adjustment?: number | null
          product_id?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          badge_color: string | null
          badge_text: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          images: string[] | null
          name: string
          price: number
          stock: number
          subcategory: string[] | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge_color?: string | null
          badge_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          name: string
          price: number
          stock?: number
          subcategory?: string[] | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge_color?: string | null
          badge_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          name?: string
          price?: number
          stock?: number
          subcategory?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          level: number
          points: number
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          level?: number
          points?: number
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          points?: number
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          xp_cost: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          xp_cost: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          xp_cost?: number
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          sold_by: string
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          sold_by: string
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          sold_by?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      shipping_status_enum:
        | "pending"
        | "processing"
        | "shipped"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
      user_role:
        | "superadmin"
        | "employee"
        | "user"
        | "admin"
        | "manager"
        | "cliente"
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
      shipping_status_enum: [
        "pending",
        "processing",
        "shipped",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      user_role: [
        "superadmin",
        "employee",
        "user",
        "admin",
        "manager",
        "cliente",
      ],
    },
  },
} as const
