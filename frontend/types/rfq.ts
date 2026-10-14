export interface RFQ {
  id: string
  rfqNumber: string
  title: string
  description?: string
  department: string
  items: RFQItem[]
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  requestedBy: string
  requestedByName?: string
  approvedBy?: string
  approvedByName?: string
  approvedAt?: string
  submissionDeadline?: string
  budgetEstimate: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface RFQItem {
  id: string
  name: string
  description?: string
  quantity: number
  unit: string
  estimatedPrice?: number
  specifications?: Record<string, any>
}

export interface RFQFilters {
  search?: string
  status?: string
  priority?: string
  department?: string
}

export interface RFQStats {
  total: number
  draft: number
  pending: number
  approved: number
  rejected: number
  completed: number
}
