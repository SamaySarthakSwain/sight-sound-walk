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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      food_places: {
        Row: {
          avg_price_max: number | null
          avg_price_min: number | null
          category: string
          created_at: string
          description: string | null
          famous_dishes: string[] | null
          google_last_updated: string | null
          google_place_id: string | null
          google_rating: number | null
          google_total_ratings: number | null
          id: string
          image_url: string | null
          is_food_street: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          updated_at: string
        }
        Insert: {
          avg_price_max?: number | null
          avg_price_min?: number | null
          category: string
          created_at?: string
          description?: string | null
          famous_dishes?: string[] | null
          google_last_updated?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string
          image_url?: string | null
          is_food_street?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          avg_price_max?: number | null
          avg_price_min?: number | null
          category?: string
          created_at?: string
          description?: string | null
          famous_dishes?: string[] | null
          google_last_updated?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string
          image_url?: string | null
          is_food_street?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_ratings: {
        Row: {
          ate_here: boolean
          comment: string | null
          created_at: string
          food_place_id: string
          hygiene_rating: number
          id: string
          overall_rating: number
          taste_rating: number
          user_id: string
          value_rating: number
        }
        Insert: {
          ate_here?: boolean
          comment?: string | null
          created_at?: string
          food_place_id: string
          hygiene_rating: number
          id?: string
          overall_rating: number
          taste_rating: number
          user_id: string
          value_rating: number
        }
        Update: {
          ate_here?: boolean
          comment?: string | null
          created_at?: string
          food_place_id?: string
          hygiene_rating?: number
          id?: string
          overall_rating?: number
          taste_rating?: number
          user_id?: string
          value_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "food_ratings_food_place_id_fkey"
            columns: ["food_place_id"]
            isOneToOne: false
            referencedRelation: "food_places"
            referencedColumns: ["id"]
          },
        ]
      }
      monuments: {
        Row: {
          category: string
          created_at: string
          description: string
          distance_from_berhampur: string | null
          facts: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          region: string | null
          state: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          distance_from_berhampur?: string | null
          facts?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          region?: string | null
          state: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          distance_from_berhampur?: string | null
          facts?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          region?: string | null
          state?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      search_history: {
        Row: {
          end_location: string
          id: string
          searched_at: string
          start_location: string
          user_id: string
        }
        Insert: {
          end_location: string
          id?: string
          searched_at?: string
          start_location: string
          user_id: string
        }
        Update: {
          end_location?: string
          id?: string
          searched_at?: string
          start_location?: string
          user_id?: string
        }
        Relationships: []
      }
      visit_history: {
        Row: {
          id: string
          place_category: string | null
          place_image: string | null
          place_name: string
          user_id: string
          visited_at: string
        }
        Insert: {
          id?: string
          place_category?: string | null
          place_image?: string | null
          place_name: string
          user_id: string
          visited_at?: string
        }
        Update: {
          id?: string
          place_category?: string | null
          place_image?: string | null
          place_name?: string
          user_id?: string
          visited_at?: string
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
