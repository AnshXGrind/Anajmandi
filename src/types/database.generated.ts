export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
export type UserRole = 'farmer' | 'buyer' | 'logistics_provider' | 'admin'
export type VerificationStatus = 'pending' | 'verified' | 'rejected'
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'cancelled'
export type QualityGrade = 'A' | 'B' | 'C'
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] }
type Profile = { id:string; email:string; full_name:string; phone:string|null; avatar_url:string|null; role:UserRole; verification_status:VerificationStatus; state:string|null; district:string|null; pincode:string|null; address:string|null; is_active:boolean; created_at:string; updated_at:string }
type Listing = { id:string; farmer_id:string; category_id:string|null; title:string; description:string|null; variety:string|null; quality_grade:QualityGrade; price_per_kg:number; quantity_kg:number; available_quantity_kg:number; unit:string; harvest_date:string|null; available_from:string|null; available_until:string|null; pickup_address:string; state:string; district:string; status:ListingStatus; created_at:string; updated_at:string }
type Offer = { id:string; listing_id:string; buyer_id:string; farmer_id:string; quantity_kg:number; offered_price_per_kg:number; message:string|null; status:OfferStatus; created_at:string; updated_at:string }
type Category = { id:string; name:string; slug:string; created_at:string }
type Image = { id:string; listing_id:string; storage_path:string; alt_text:string|null; sort_order:number; created_at:string }
type Order = { id:string; order_number:string; buyer_id:string; farmer_id:string; offer_id:string|null; status:OrderStatus; subtotal:number; platform_fee:number; total_amount:number; payment_status:PaymentStatus; delivery_address:string|null; created_at:string; updated_at:string }
type OrderItem = { id:string; order_id:string; listing_id:string; quantity_kg:number; agreed_price_per_kg:number; total_amount:number }
type OrderHistory = { id:string; order_id:string; status:OrderStatus; notes:string|null; changed_by:string|null; created_at:string }
type Payment = { id:string; order_id:string; buyer_id:string; razorpay_order_id:string|null; razorpay_payment_id:string|null; razorpay_signature:string|null; amount:number; currency:string; status:PaymentStatus; failure_reason:string|null; created_at:string; updated_at:string }

export interface FarmLinkDatabase {
  public: {
    Tables: {
      profiles: Table<Profile, Omit<Profile,'created_at'|'updated_at'|'verification_status'|'is_active'> & Partial<Pick<Profile,'verification_status'|'is_active'|'created_at'|'updated_at'>>, Partial<Profile>>
      produce_categories: Table<Category, Omit<Category,'id'|'created_at'> & Partial<Pick<Category,'id'|'created_at'>>>
      produce_listings: Table<Listing, Omit<Listing,'id'|'created_at'|'updated_at'|'available_quantity_kg'|'status'> & Partial<Pick<Listing,'id'|'created_at'|'updated_at'|'available_quantity_kg'|'status'>>, Partial<Listing>>
      produce_images: Table<Image, Omit<Image,'id'|'created_at'> & Partial<Pick<Image,'id'|'created_at'>>, Partial<Image>>
      buyer_offers: Table<Offer, Omit<Offer,'id'|'created_at'|'updated_at'|'status'> & Partial<Pick<Offer,'id'|'created_at'|'updated_at'|'status'>>, Partial<Offer>>
      orders: Table<Order, Omit<Order,'id'|'order_number'|'created_at'|'updated_at'|'status'|'payment_status'> & Partial<Pick<Order,'id'|'order_number'|'created_at'|'updated_at'|'status'|'payment_status'>>, Partial<Order>>
      order_items: Table<OrderItem, Omit<OrderItem,'id'|'total_amount'> & Partial<Pick<OrderItem,'id'|'total_amount'>>, Partial<OrderItem>>
      order_status_history: Table<OrderHistory, Omit<OrderHistory,'id'|'created_at'> & Partial<Pick<OrderHistory,'id'|'created_at'>>, Partial<OrderHistory>>
      payment_transactions: Table<Payment, Omit<Payment,'id'|'created_at'|'updated_at'|'status'|'currency'> & Partial<Pick<Payment,'id'|'created_at'|'updated_at'|'status'|'currency'>>, Partial<Payment>>
    }
    Views: { public_farmer_profiles: { Row: Pick<Profile,'id'|'full_name'|'verification_status'|'state'|'district'>; Relationships: [] } }
    Functions: { accept_offer: { Args: { offer_id:string }; Returns: Json }; reject_offer: { Args: { offer_id:string }; Returns: undefined }; withdraw_offer: { Args: { offer_id:string }; Returns: undefined }; get_my_private_profile: { Args: Record<string, never>; Returns: Json } }
    Enums: { user_role: UserRole; verification_status: VerificationStatus; listing_status: ListingStatus; quality_grade: QualityGrade; offer_status: OfferStatus; order_status: OrderStatus; payment_status: PaymentStatus }
    CompositeTypes: Record<string, never>
  }
}
