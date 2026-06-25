export interface Category {
  id: number
  name: string
  display_order: number
  is_active: boolean
}

export interface PortfolioImage {
  id: number
  public_id: string
  image_url: string
  category_id: number
  caption: string | null
  display_order: number
  is_active: boolean
  created_at: string
  edited_at: string
}

export interface Service {
  id: number
  title: string
  description: string
  includes: string
  price: number
  image_url: string | null
  is_active: boolean
  created_at: string
  edited_at: string
}

export type BookingStatus = 'NEW' | 'REVIEWED' | 'RESPONDED'

export interface Booking {
  id: number
  service_id: number | null
  name: string
  email: string
  phone: string | null
  event_name: string | null
  event_date: string | null
  message: string | null
  status: BookingStatus
  admin_note: string | null
  reviewed_at: string | null
  created_at: string
}

export interface DashboardData {
  total_images: number
  total_categories: number
  total_services: number
  new_bookings: number
  reviewed_bookings: number
}

export interface APIResponseEnvelope<T> {
  success: boolean
  message: string
  data?: T
  errors?: any
}

export interface PaginatedResponseEnvelope<T> {
  success: boolean
  message: string
  data: T[]
  page: number
  limit: number
  total: number
}
