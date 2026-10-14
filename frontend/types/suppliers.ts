export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  website?: string
  category: string
  rating: number
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  totalSpend: number
  contracts: number
  performance: {
    onTimeDelivery: number
    qualityScore: number
    responseTime: number
    costCompetitiveness: number
    compliance: number
    overall: number
  }
  createdAt: string
  updatedAt: string
}

export interface SupplierStats {
  total: number
  active: number
  pending: number
  averageRating: number
  totalSpend: number
}

export interface SupplierFilters {
  category?: string
  status?: string
  rating?: number
  search?: string
}
