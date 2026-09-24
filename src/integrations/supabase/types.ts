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
      cab_services: {
        Row: {
          avg_wait_time_mins: number | null
          base_fare_2w: number | null
          base_fare_3w: number | null
          base_fare_4w: number | null
          created_at: string
          eco_rating: number | null
          has_2_wheeler: boolean | null
          has_3_wheeler: boolean | null
          has_4_wheeler: boolean | null
          id: string
          is_local: boolean | null
          logo_url: string | null
          name: string
          per_km_2w: number | null
          per_km_3w: number | null
          per_km_4w: number | null
          updated_at: string
        }
        Insert: {
          avg_wait_time_mins?: number | null
          base_fare_2w?: number | null
          base_fare_3w?: number | null
          base_fare_4w?: number | null
          created_at?: string
          eco_rating?: number | null
          has_2_wheeler?: boolean | null
          has_3_wheeler?: boolean | null
          has_4_wheeler?: boolean | null
          id?: string
          is_local?: boolean | null
          logo_url?: string | null
          name: string
          per_km_2w?: number | null
          per_km_3w?: number | null
          per_km_4w?: number | null
          updated_at?: string
        }
        Update: {
          avg_wait_time_mins?: number | null
          base_fare_2w?: number | null
          base_fare_3w?: number | null
          base_fare_4w?: number | null
          created_at?: string
          eco_rating?: number | null
          has_2_wheeler?: boolean | null
          has_3_wheeler?: boolean | null
          has_4_wheeler?: boolean | null
          id?: string
          is_local?: boolean | null
          logo_url?: string | null
          name?: string
          per_km_2w?: number | null
          per_km_3w?: number | null
          per_km_4w?: number | null
          updated_at?: string
        }
        Relationships: []
      }
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
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          available_rooms: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          google_place_id: string | null
          google_rating: number | null
          google_total_ratings: number | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          price_per_night_max: number | null
          price_per_night_min: number | null
          star_rating: number | null
          total_rooms: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          available_rooms?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          price_per_night_max?: number | null
          price_per_night_min?: number | null
          star_rating?: number | null
          total_rooms?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          available_rooms?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          price_per_night_max?: number | null
          price_per_night_min?: number | null
          star_rating?: number | null
          total_rooms?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
      trip_feedback: {
        Row: {
          comment: string | null
          created_at: string
          driver_rating: number | null
          id: string
          punctuality: number | null
          rating: number
          trip_id: string | null
          user_id: string
          vehicle_condition: number | null
          would_recommend: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          driver_rating?: number | null
          id?: string
          punctuality?: number | null
          rating: number
          trip_id?: string | null
          user_id: string
          vehicle_condition?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          driver_rating?: number | null
          id?: string
          punctuality?: number | null
          rating?: number
          trip_id?: string | null
          user_id?: string
          vehicle_condition?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_feedback_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip_history"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_history: {
        Row: {
          actual_fare: number | null
          cab_service_id: string | null
          created_at: string
          distance_km: number | null
          duration_mins: number | null
          end_lat: number | null
          end_lng: number | null
          end_location: string
          estimated_fare: number | null
          id: string
          passengers: number | null
          start_lat: number | null
          start_lng: number | null
          start_location: string
          stops: Json | null
          user_id: string
          vehicle_type_id: string | null
        }
        Insert: {
          actual_fare?: number | null
          cab_service_id?: string | null
          created_at?: string
          distance_km?: number | null
          duration_mins?: number | null
          end_lat?: number | null
          end_lng?: number | null
          end_location: string
          estimated_fare?: number | null
          id?: string
          passengers?: number | null
          start_lat?: number | null
          start_lng?: number | null
          start_location: string
          stops?: Json | null
          user_id: string
          vehicle_type_id?: string | null
        }
        Update: {
          actual_fare?: number | null
          cab_service_id?: string | null
          created_at?: string
          distance_km?: number | null
          duration_mins?: number | null
          end_lat?: number | null
          end_lng?: number | null
          end_location?: string
          estimated_fare?: number | null
          id?: string
          passengers?: number | null
          start_lat?: number | null
          start_lng?: number | null
          start_location?: string
          stops?: Json | null
          user_id?: string
          vehicle_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_history_cab_service_id_fkey"
            columns: ["cab_service_id"]
            isOneToOne: false
            referencedRelation: "cab_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_history_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          base_fare: number | null
          cab_service_id: string | null
          capacity: number
          created_at: string
          id: string
          is_eco_friendly: boolean | null
          per_km_rate: number | null
          per_min_rate: number | null
          vehicle_name: string
          vehicle_type: string
        }
        Insert: {
          base_fare?: number | null
          cab_service_id?: string | null
          capacity: number
          created_at?: string
          id?: string
          is_eco_friendly?: boolean | null
          per_km_rate?: number | null
          per_min_rate?: number | null
          vehicle_name: string
          vehicle_type: string
        }
        Update: {
          base_fare?: number | null
          cab_service_id?: string | null
          capacity?: number
          created_at?: string
          id?: string
          is_eco_friendly?: boolean | null
          per_km_rate?: number | null
          per_min_rate?: number | null
          vehicle_name?: string
          vehicle_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_types_cab_service_id_fkey"
            columns: ["cab_service_id"]
            isOneToOne: false
            referencedRelation: "cab_services"
            referencedColumns: ["id"]
          },
        ]
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
      food_ratings_public: {
        Row: {
          ate_here: boolean | null
          comment: string | null
          created_at: string | null
          food_place_id: string | null
          hygiene_rating: number | null
          id: string | null
          overall_rating: number | null
          taste_rating: number | null
          value_rating: number | null
        }
        Insert: {
          ate_here?: boolean | null
          comment?: string | null
          created_at?: string | null
          food_place_id?: string | null
          hygiene_rating?: number | null
          id?: string | null
          overall_rating?: number | null
          taste_rating?: number | null
          value_rating?: number | null
        }
        Update: {
          ate_here?: boolean | null
          comment?: string | null
          created_at?: string | null
          food_place_id?: string | null
          hygiene_rating?: number | null
          id?: string | null
          overall_rating?: number | null
          taste_rating?: number | null
          value_rating?: number | null
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
      hotels_public: {
        Row: {
          address: string | null
          amenities: string[] | null
          available_rooms: number | null
          created_at: string | null
          description: string | null
          google_place_id: string | null
          google_rating: number | null
          google_total_ratings: number | null
          id: string | null
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          price_per_night_max: number | null
          price_per_night_min: number | null
          star_rating: number | null
          total_rooms: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          available_rooms?: number | null
          created_at?: string | null
          description?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string | null
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          price_per_night_max?: number | null
          price_per_night_min?: number | null
          star_rating?: number | null
          total_rooms?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          available_rooms?: number | null
          created_at?: string | null
          description?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_total_ratings?: number | null
          id?: string | null
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          price_per_night_max?: number | null
          price_per_night_min?: number | null
          star_rating?: number | null
          total_rooms?: number | null
          updated_at?: string | null
          website?: string | null
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
    Enums: {},
  },
} as const
