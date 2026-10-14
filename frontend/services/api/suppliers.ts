import api from './client'
import { Supplier, SupplierFilters, SupplierStats } from '@/types/suppliers'

export const supplierService = {
  async getAll(filters?: SupplierFilters): Promise<Supplier[]> {
    const response = await api.get('/suppliers', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<Supplier> {
    const response = await api.get(`/suppliers/${id}`)
    return response.data
  },

  async create(data: Partial<Supplier>): Promise<Supplier> {
    const response = await api.post('/suppliers', data)
    return response.data
  },

  async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`)
  },

  async getStats(): Promise<SupplierStats> {
    const response = await api.get('/suppliers/stats')
    return response.data
  }
}
