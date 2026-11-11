// Re-export all database types
export type {
  Database,
  Json,
  UserRole,
  VerificationStatus,
  ListingStatus,
  QualityGrade,
  OfferStatus,
  OrderStatus,
  PaymentStatus,
  TransportStatus,
  StorageType,
  NotificationType,
  DisputeStatus,
  PrivateProfile,
  Profile,
  FarmerProfile,
  BuyerProfile,
  LogisticsProfile,
  ProduceCategory,
  ProduceListing,
  ProduceImage,
  BuyerOffer,
  Order,
  OrderItem,
  OrderStatusHistory,
  TransportVehicle,
  TransportRequest,
  TransportBooking,
  SharedTransportMember,
  StorageFacility,
  StorageBooking,
  PaymentTransaction,
  VerificationRequest,
  Conversation,
  Message,
  Notification,
  Review,
  Dispute,
  AuditLog,
  ListingWithDetails,
  OrderWithDetails,
} from './database'

// App-specific types
export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ListingFilters {
  category?: string
  state?: string
  district?: string
  minPrice?: number
  maxPrice?: number
  qualityGrade?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface DashboardStats {
  totalListings?: number
  activeListings?: number
  totalOrders?: number
  pendingOrders?: number
  totalEarnings?: number
  pendingOffers?: number
  unreadMessages?: number
  unreadNotifications?: number
}
