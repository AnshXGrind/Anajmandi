export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

export type IndianState = (typeof INDIAN_STATES)[number]

export const CROP_CATEGORIES = [
  { id: 'grains', name: 'Grains & Cereals', nameHindi: 'अनाज' },
  { id: 'vegetables', name: 'Vegetables', nameHindi: 'सब्जियाँ' },
  { id: 'fruits', name: 'Fruits', nameHindi: 'फल' },
  { id: 'pulses', name: 'Pulses & Legumes', nameHindi: 'दालें' },
  { id: 'oilseeds', name: 'Oilseeds', nameHindi: 'तिलहन' },
  { id: 'spices', name: 'Spices & Herbs', nameHindi: 'मसाले' },
  { id: 'cotton', name: 'Cotton & Fibers', nameHindi: 'कपास' },
  { id: 'sugarcane', name: 'Sugarcane & Sugar', nameHindi: 'गन्ना' },
  { id: 'dairy', name: 'Dairy Products', nameHindi: 'डेयरी' },
  { id: 'other', name: 'Other Produce', nameHindi: 'अन्य' },
] as const

export const QUALITY_GRADES = [
  { value: 'A', label: 'Grade A – Premium', description: 'Best quality, no defects' },
  { value: 'B', label: 'Grade B – Good', description: 'Good quality, minor imperfections' },
  { value: 'C', label: 'Grade C – Standard', description: 'Standard quality' },
] as const

export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  processing: { label: 'Processing', color: 'purple' },
  in_transit: { label: 'In Transit', color: 'orange' },
  delivered: { label: 'Delivered', color: 'teal' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  disputed: { label: 'Disputed', color: 'red' },
} as const

export const OFFER_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  accepted: { label: 'Accepted', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  expired: { label: 'Expired', color: 'gray' },
  withdrawn: { label: 'Withdrawn', color: 'gray' },
} as const

export const USER_ROLES = {
  farmer: { label: 'Farmer', description: 'Sell your produce directly to buyers' },
  buyer: { label: 'Buyer', description: 'Source fresh produce from farmers' },
  logistics_provider: { label: 'Logistics Provider', description: 'Provide transport services' },
  admin: { label: 'Admin', description: 'Platform administration' },
} as const

export const PLATFORM_FEE_PERCENTAGE = 2.5 // 2.5% platform fee

export const MIN_ORDER_VALUE = 500 // ₹500 minimum order

export const SUPPORTED_PAYMENT_METHODS = ['upi', 'netbanking', 'card', 'wallet'] as const

export const LISTING_EXPIRY_DAYS = 30

export const APP_NAME = 'FarmLink'
export const APP_TAGLINE = 'Direct from Farm to Market'
export const APP_DESCRIPTION =
  'FarmLink connects Indian farmers directly with buyers, eliminating middlemen and ensuring fair prices for everyone.'

export const CONTACT_EMAIL = 'support@farmlink.in'
export const CONTACT_PHONE = '+91 1800-XXX-XXXX'

export const RAZORPAY_CURRENCY = 'INR'
