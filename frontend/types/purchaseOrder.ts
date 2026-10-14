export interface PurchaseOrder {
  id: string
  poNumber: string
  title: string
  description?: string
  supplierId: string
  supplierName: string
  department: string
  items: POItem[]
  totalAmount: number
  budgetCode?: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  requestedBy: string
  requestedByName: string
  approvedBy?: string
  approvedByName?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  expectedDeliveryDate?: string
  deliveryDate?: string
  notes?: string
  attachments?: string[]
  tags?: string[]
}

export interface POItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unit: string
  catalogNumber?: string
  specifications?: Record<string, any>
}

export interface PurchaseOrderFilters {
  search?: string
  status?: string
  department?: string
  supplierId?: string
  dateFrom?: string
  dateTo?: string
  priority?: string
}

export interface PurchaseOrderStats {
  total: number
  pending: number
  approved: number
  rejected: number
  completed: number
  draft: number
  totalValue: number
  pendingValue: number
  approvedValue: number
  byDepartment: Record<string, number>
  byPriority: Record<string, number>
}

export interface CreatePurchaseOrderDTO {
  title: string
  description?: string
  supplierId: string
  department: string
  items: Omit<POItem, 'id' | 'totalPrice'>[]
  budgetCode?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  requestedBy: string
  expectedDeliveryDate?: string
  notes?: string
  tags?: string[]
}

export interface UpdatePurchaseOrderDTO extends Partial<CreatePurchaseOrderDTO> {
  status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed'
}
