import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { procurementService } from '@/services/api/procurement'
import { Procurement, ProcurementFilters } from '@/types/procurement'
import { toast } from 'sonner'

export function useProcurements(filters?: ProcurementFilters) {
  return useQuery({
    queryKey: ['procurements', filters],
    queryFn: () => procurementService.getAll(filters),
  })
}

export function useProcurement(id: string) {
  return useQuery({
    queryKey: ['procurement', id],
    queryFn: () => procurementService.getById(id),
    enabled: !!id,
  })
}

export function useProcurementStats() {
  return useQuery({
    queryKey: ['procurement-stats'],
    queryFn: () => procurementService.getStats(),
  })
}

export function useCreateProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Procurement>) => procurementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
      queryClient.invalidateQueries({ queryKey: ['procurement-stats'] })
      toast.success('Procurement created successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to create procurement', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useUpdateProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Procurement> }) =>
      procurementService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
      queryClient.invalidateQueries({ queryKey: ['procurement', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['procurement-stats'] })
      toast.success('Procurement updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update procurement', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useDeleteProcurement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => procurementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurements'] })
      queryClient.invalidateQueries({ queryKey: ['procurement-stats'] })
      toast.success('Procurement deleted successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to delete procurement', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}
