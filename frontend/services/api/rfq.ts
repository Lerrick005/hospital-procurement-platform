import api from './client'
import { RFQ, RFQFilters, RFQStats } from '@/types/rfq'

export const rfqService = {
  async getAll(filters?: RFQFilters): Promise<RFQ[]> {
    const response = await api.get('/rfq', { params: filters })
    return response.data
  },

  async getById(id: string): Promise<RFQ> {
    const response = await api.get(`/rfq/${id}`)
    return response.data
  },

  async create(data: Partial<RFQ>): Promise<RFQ> {
    const response = await api.post('/rfq', data)
    return response.data
  },

  async update(id: string, data: Partial<RFQ>): Promise<RFQ> {
    const response = await api.put(`/rfq/${id}`, data)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/rfq/${id}`)
  },

  async getStats(): Promise<RFQStats> {
    const response = await api.get('/rfq/stats')
    return response.data
  },

  async submit(id: string): Promise<RFQ> {
    const response = await api.post(`/rfq/${id}/submit`)
    return response.data
  },

  async approve(id: string): Promise<RFQ> {
    const response = await api.post(`/rfq/${id}/approve`)
    return response.data
  },

  async reject(id: string, reason: string): Promise<RFQ> {
    const response = await api.post(`/rfq/${id}/reject`, { reason })
    return response.data
  }
}
