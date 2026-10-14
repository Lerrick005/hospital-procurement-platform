import api from './client'
import { Procurement, ProcurementFilters, ProcurementStats } from '@/types/procurement'

export const procurementService = {
  async getAll(filters?: ProcurementFilters): Promise<Procurement[]> {
    const response = await api.get('/procurement', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<Procurement> {
    const response = await api.get(/procurement/)
    return response.data
  },

  async create(data: Partial<Procurement>): Promise<Procurement> {
    const response = await api.post('/procurement', data)
    return response.data
  },

  async update(id: string, data: Partial<Procurement>): Promise<Procurement> {
    const response = await api.put(/procurement/, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(/procurement/)
  },

  async getStats(): Promise<ProcurementStats> {
    const response = await api.get('/procurement/stats')
    return response.data
  },

  async approve(id: string): Promise<Procurement> {
    const response = await api.post(/procurement//approve)
    return response.data
  },

  async reject(id: string, reason: string): Promise<Procurement> {
    const response = await api.post(/procurement//reject, { reason })
    return response.data
  }
}
