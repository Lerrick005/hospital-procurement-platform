import api from './client'
import { 
  PurchaseOrder, 
  PurchaseOrderFilters, 
  PurchaseOrderStats,
  CreatePurchaseOrderDTO,
  UpdatePurchaseOrderDTO
} from '@/types/purchaseOrder'

export const purchaseOrderService = {
  async getAll(filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> {
    const response = await api.get('/pos', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<PurchaseOrder> {
    const response = await api.get(`/purchase-orders/${id}`)
    return response.data
  },

  async create(data: CreatePurchaseOrderDTO): Promise<PurchaseOrder> {
    const response = await api.post('/pos', data)
    return response.data
  },

  async update(id: string, data: UpdatePurchaseOrderDTO): Promise<PurchaseOrder> {
    const response = await api.put(`/purchase-orders/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/purchase-orders/${id}`)
  },

  async getStats(): Promise<PurchaseOrderStats> {
    const response = await api.get('/purchase-orders/stats')
    return response.data
  },

  async approve(id: string, notes?: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${id}/approve`, { notes })
    return response.data
  },

  async reject(id: string, reason: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${id}/reject`, { reason })
    return response.data
  },

  async complete(id: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${id}/complete`)
    return response.data
  },

  async submitForApproval(id: string): Promise<PurchaseOrder> {
    const response = await api.post(`/purchase-orders/${id}/submit`)
    return response.data
  }
}

