export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'farmer' | 'buyer' | 'logistics_provider' | 'admin'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'cancelled'
export type QualityGrade = 'A' | 'B' | 'C'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
export type TransportStatus = 'available' | 'booked' | 'in_transit' | 'completed'
export type StorageType = 'cold_storage' | 'warehouse' | 'silo'
export type NotificationType = 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'order_confirmed' | 'order_delivered' | 'payment_received' | 'new_message' | 'system'
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'closed'
export type PrivateProfile = {
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  verification_status: VerificationStatus
  state: string | null
  district: string | null
  lgd_state_code: number | null
  lgd_district_code: number | null
  pincode: string | null
  address: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: UserRole
          verification_status: VerificationStatus
          state: string | null
          district: string | null
          lgd_state_code: number | null
          lgd_district_code: number | null
          pincode: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role: UserRole
          verification_status?: VerificationStatus
          state?: string | null
          district?: string | null
          lgd_state_code?: number | null
          lgd_district_code?: number | null
          pincode?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          verification_status?: VerificationStatus
          state?: string | null
          district?: string | null
          lgd_state_code?: number | null
          lgd_district_code?: number | null
          pincode?: string | null
          address?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      farmer_profiles: {
        Row: {
          id: string
          profile_id: string
          farm_name: string | null
          farm_size_acres: number | null
          primary_crops: string[]
          bank_account_number: string | null
          bank_ifsc: string | null
          bank_name: string | null
          aadhaar_number: string | null
          pan_number: string | null
          total_listings: number
          total_sales: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          farm_name?: string | null
          farm_size_acres?: number | null
          primary_crops?: string[]
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          aadhaar_number?: string | null
          pan_number?: string | null
          total_listings?: number
          total_sales?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          farm_name?: string | null
          farm_size_acres?: number | null
          primary_crops?: string[]
          bank_account_number?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          aadhaar_number?: string | null
          pan_number?: string | null
          total_listings?: number
          total_sales?: number
          average_rating?: number
          updated_at?: string
        }
      }
      buyer_profiles: {
        Row: {
          id: string
          profile_id: string
          business_name: string | null
          business_type: string | null
          gst_number: string | null
          pan_number: string | null
          preferred_categories: string[]
          total_orders: number
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          business_name?: string | null
          business_type?: string | null
          gst_number?: string | null
          pan_number?: string | null
          preferred_categories?: string[]
          total_orders?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          gst_number?: string | null
          pan_number?: string | null
          preferred_categories?: string[]
          total_orders?: number
          average_rating?: number
          updated_at?: string
        }
      }
      logistics_profiles: {
        Row: {
          id: string
          profile_id: string
          company_name: string | null
          vehicle_count: number
          service_states: string[]
          license_number: string | null
          average_rating: number
          total_trips: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          company_name?: string | null
          vehicle_count?: number
          service_states?: string[]
          license_number?: string | null
          average_rating?: number
          total_trips?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          vehicle_count?: number
          service_states?: string[]
          license_number?: string | null
          average_rating?: number
          total_trips?: number
          updated_at?: string
        }
      }
      produce_categories: {
        Row: {
          id: string
          name: string
          name_hindi: string | null
          slug: string
          icon_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_hindi?: string | null
          slug: string
          icon_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          name_hindi?: string | null
          slug?: string
          icon_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      produce_listings: {
        Row: {
          id: string
          farmer_id: string
          category_id: string
          title: string
          description: string | null
          quantity_kg: number
          price_per_kg: number
          min_order_kg: number
          quality_grade: QualityGrade
          harvest_date: string | null
          available_from: string
          available_until: string | null
          state: string
          district: string
          lgd_state_code: number | null
          lgd_district_code: number | null
          pincode: string | null
          status: ListingStatus
          view_count: number
          offer_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          category_id: string
          title: string
          description?: string | null
          quantity_kg: number
          price_per_kg: number
          min_order_kg?: number
          quality_grade?: QualityGrade
          harvest_date?: string | null
          available_from?: string
          available_until?: string | null
          state: string
          district: string
          lgd_state_code?: number | null
          lgd_district_code?: number | null
          pincode?: string | null
          status?: ListingStatus
          view_count?: number
          offer_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          title?: string
          description?: string | null
          quantity_kg?: number
          price_per_kg?: number
          min_order_kg?: number
          quality_grade?: QualityGrade
          harvest_date?: string | null
          available_from?: string
          available_until?: string | null
          state?: string
          district?: string
          lgd_state_code?: number | null
          lgd_district_code?: number | null
          pincode?: string | null
          status?: ListingStatus
          view_count?: number
          offer_count?: number
          updated_at?: string
        }
      }
      produce_images: {
        Row: {
          id: string
          listing_id: string
          url: string
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          url: string
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          url?: string
          is_primary?: boolean
          sort_order?: number
        }
      }
      buyer_offers: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          farmer_id: string
          quantity_kg: number
          offered_price_per_kg: number
          total_amount: number
          message: string | null
          status: OfferStatus
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          farmer_id: string
          quantity_kg: number
          offered_price_per_kg: number
          total_amount: number
          message?: string | null
          status?: OfferStatus
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          quantity_kg?: number
          offered_price_per_kg?: number
          total_amount?: number
          message?: string | null
          status?: OfferStatus
          expires_at?: string | null
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          buyer_id: string
          farmer_id: string
          offer_id: string | null
          total_amount: number
          platform_fee: number
          farmer_payout: number
          status: OrderStatus
          delivery_address: string | null
          delivery_state: string | null
          delivery_district: string | null
          delivery_pincode: string | null
          expected_delivery_date: string | null
          actual_delivery_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          buyer_id: string
          farmer_id: string
          offer_id?: string | null
          total_amount: number
          platform_fee?: number
          farmer_payout?: number
          status?: OrderStatus
          delivery_address?: string | null
          delivery_state?: string | null
          delivery_district?: string | null
          delivery_pincode?: string | null
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          total_amount?: number
          platform_fee?: number
          farmer_payout?: number
          status?: OrderStatus
          delivery_address?: string | null
          delivery_state?: string | null
          delivery_district?: string | null
          delivery_pincode?: string | null
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          listing_id: string
          quantity_kg: number
          price_per_kg: number
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          listing_id: string
          quantity_kg: number
          price_per_kg: number
          total_amount: number
          created_at?: string
        }
        Update: {
          quantity_kg?: number
          price_per_kg?: number
          total_amount?: number
        }
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          status: OrderStatus
          notes: string | null
          changed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          status: OrderStatus
          notes?: string | null
          changed_by?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      transport_vehicles: {
        Row: {
          id: string
          provider_id: string
          vehicle_number: string
          vehicle_type: string
          capacity_kg: number
          refrigerated: boolean
          state: string
          district: string | null
          status: TransportStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          vehicle_number: string
          vehicle_type: string
          capacity_kg: number
          refrigerated?: boolean
          state: string
          district?: string | null
          status?: TransportStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          vehicle_number?: string
          vehicle_type?: string
          capacity_kg?: number
          refrigerated?: boolean
          state?: string
          district?: string | null
          status?: TransportStatus
          updated_at?: string
        }
      }
      transport_requests: {
        Row: {
          id: string
          order_id: string
          requester_id: string
          pickup_address: string
          pickup_state: string
          pickup_district: string
          pickup_date: string
          delivery_address: string
          delivery_state: string
          delivery_district: string
          quantity_kg: number
          refrigerated_required: boolean
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          requester_id: string
          pickup_address: string
          pickup_state: string
          pickup_district: string
          pickup_date: string
          delivery_address: string
          delivery_state: string
          delivery_district: string
          quantity_kg: number
          refrigerated_required?: boolean
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          pickup_address?: string
          pickup_state?: string
          pickup_district?: string
          pickup_date?: string
          delivery_address?: string
          delivery_state?: string
          delivery_district?: string
          quantity_kg?: number
          refrigerated_required?: boolean
          notes?: string | null
          status?: string
          updated_at?: string
        }
      }
      transport_bookings: {
        Row: {
          id: string
          request_id: string
          vehicle_id: string
          provider_id: string
          quoted_price: number
          final_price: number | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          vehicle_id: string
          provider_id: string
          quoted_price: number
          final_price?: number | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          final_price?: number | null
          status?: string
          notes?: string | null
          updated_at?: string
        }
      }
      shared_transport_members: {
        Row: {
          id: string
          booking_id: string
          member_id: string
          quantity_kg: number
          cost_share: number
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          member_id: string
          quantity_kg: number
          cost_share: number
          created_at?: string
        }
        Update: {
          quantity_kg?: number
          cost_share?: number
        }
      }
      storage_facilities: {
        Row: {
          id: string
          owner_id: string
          name: string
          storage_type: StorageType
          capacity_kg: number
          available_capacity_kg: number
          price_per_kg_per_day: number
          state: string
          district: string
          address: string | null
          temperature_min: number | null
          temperature_max: number | null
          is_active: boolean
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          storage_type: StorageType
          capacity_kg: number
          available_capacity_kg: number
          price_per_kg_per_day: number
          state: string
          district: string
          address?: string | null
          temperature_min?: number | null
          temperature_max?: number | null
          is_active?: boolean
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          storage_type?: StorageType
          capacity_kg?: number
          available_capacity_kg?: number
          price_per_kg_per_day?: number
          state?: string
          district?: string
          address?: string | null
          temperature_min?: number | null
          temperature_max?: number | null
          is_active?: boolean
          average_rating?: number
          updated_at?: string
        }
      }
      storage_bookings: {
        Row: {
          id: string
          facility_id: string
          farmer_id: string
          quantity_kg: number
          start_date: string
          end_date: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          facility_id: string
          farmer_id: string
          quantity_kg: number
          start_date: string
          end_date: string
          total_amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          quantity_kg?: number
          start_date?: string
          end_date?: string
          total_amount?: number
          status?: string
          updated_at?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          order_id: string
          buyer_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          amount: number
          currency: string
          status: PaymentStatus
          payment_method: string | null
          failure_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          buyer_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          amount: number
          currency?: string
          status?: PaymentStatus
          payment_method?: string | null
          failure_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          amount?: number
          status?: PaymentStatus
          payment_method?: string | null
          failure_reason?: string | null
          updated_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          profile_id: string
          document_type: string
          document_url: string
          notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          status: VerificationStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          document_type: string
          document_url: string
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          status?: VerificationStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          document_type?: string
          document_url?: string
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          status?: VerificationStatus
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          participant_one_id: string
          participant_two_id: string
          listing_id: string | null
          order_id: string | null
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_one_id: string
          participant_two_id: string
          listing_id?: string | null
          order_id?: string | null
          last_message_at?: string | null
          created_at?: string
        }
        Update: {
          listing_id?: string | null
          order_id?: string | null
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          data?: Json | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
      disputes: {
        Row: {
          id: string
          order_id: string
          raised_by: string
          assigned_to: string | null
          reason: string
          description: string
          resolution: string | null
          status: DisputeStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          raised_by: string
          assigned_to?: string | null
          reason: string
          description: string
          resolution?: string | null
          status?: DisputeStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          reason?: string
          description?: string
          resolution?: string | null
          status?: DisputeStatus
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: {
      public_farmer_profiles: {
        Row: { id: string; full_name: string; verification_status: VerificationStatus; state: string | null; district: string | null }
        Insert: never
        Update: never
      }
    }
    Functions: {
      accept_offer: { Args: { offer_id: string }; Returns: Json }
      reject_offer: { Args: { offer_id: string }; Returns: undefined }
      withdraw_offer: { Args: { offer_id: string }; Returns: undefined }
      get_my_private_profile: { Args: Record<string, never>; Returns: PrivateProfile[] }
    }
    Enums: {
      user_role: UserRole
      verification_status: VerificationStatus
      listing_status: ListingStatus
      quality_grade: QualityGrade
      offer_status: OfferStatus
      order_status: OrderStatus
      payment_status: PaymentStatus
      notification_type: NotificationType
      dispute_status: DisputeStatus
    }
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type FarmerProfile = Database['public']['Tables']['farmer_profiles']['Row']
export type BuyerProfile = Database['public']['Tables']['buyer_profiles']['Row']
export type LogisticsProfile = Database['public']['Tables']['logistics_profiles']['Row']
export type ProduceCategory = Database['public']['Tables']['produce_categories']['Row']
export type ProduceListing = Database['public']['Tables']['produce_listings']['Row']
export type ProduceImage = Database['public']['Tables']['produce_images']['Row']
export type BuyerOffer = Database['public']['Tables']['buyer_offers']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderStatusHistory = Database['public']['Tables']['order_status_history']['Row']
export type TransportVehicle = Database['public']['Tables']['transport_vehicles']['Row']
export type TransportRequest = Database['public']['Tables']['transport_requests']['Row']
export type TransportBooking = Database['public']['Tables']['transport_bookings']['Row']
export type SharedTransportMember = Database['public']['Tables']['shared_transport_members']['Row']
export type StorageFacility = Database['public']['Tables']['storage_facilities']['Row']
export type StorageBooking = Database['public']['Tables']['storage_bookings']['Row']
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']
export type VerificationRequest = Database['public']['Tables']['verification_requests']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Dispute = Database['public']['Tables']['disputes']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

// Extended types with joins
export type ListingWithDetails = ProduceListing & {
  farmer: Profile
  category: ProduceCategory
  images: ProduceImage[]
}

export type OrderWithDetails = Order & {
  buyer: Profile
  farmer: Profile
  items: (OrderItem & { listing: ProduceListing })[]
  status_history: OrderStatusHistory[]
}
