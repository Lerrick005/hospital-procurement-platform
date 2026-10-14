export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'procurement' | 'supplier' | 'finance'
  department?: string
  hospital?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
