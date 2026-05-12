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
      media_library: {
        Row: {
          assigned: boolean | null
          created_at: string | null
          filename: string
          id: string
          nota: string | null
          product_id: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          assigned?: boolean | null
          created_at?: string | null
          filename: string
          id?: string
          nota?: string | null
          product_id?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          assigned?: boolean | null
          created_at?: string | null
          filename?: string
          id?: string
          nota?: string | null
          product_id?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_library_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_library_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          costo_unidad: number | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          image: string | null
          images: string[] | null
          name: string
          platform: string[] | null
          price: number
          slug: string | null
          stock: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          badge_color?: string | null
          badge_text?: string | null
          category?: string | null
          costo_unidad?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          images?: string[] | null
          name: string
          platform?: string[] | null
          price: number
          slug?: string | null
          stock?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          badge_color?: string | null
          badge_text?: string | null
          category?: string | null
          costo_unidad?: number | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          images?: string[] | null
          name?: string
          platform?: string[] | null
          price?: number
          slug?: string | null
          stock?: number
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
      sales: {
        Row: {
          created_at: string
          description: string | null
          id: string
          item_id: string | null
          item_type: string
          payment_method: string | null
          quantity: number
          sold_by: string
          total_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string | null
          item_type?: string
          payment_method?: string | null
          quantity: number
          sold_by?: string
          total_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          item_id?: string | null
          item_type?: string
          payment_method?: string | null
          quantity?: number
          sold_by?: string
          total_price?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          name: string
          platform: string[] | null
          price: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name: string
          platform?: string[] | null
          price?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          name?: string
          platform?: string[] | null
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: { Args: { input_text: string }; Returns: string }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      procesar_imagen_masiva:
        | {
            Args: { p_filename: string; p_product_id?: string; p_url: string }
            Returns: Json
          }
        | {
            Args: {
              p_filename: string
              p_nota?: string
              p_product_id?: string
              p_url: string
            }
            Returns: Json
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
