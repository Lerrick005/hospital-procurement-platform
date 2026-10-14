import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rfqService } from '@/services/api/rfq'
import { RFQ, RFQFilters } from '@/types/rfq'
import { toast } from 'sonner'

export function useRFQs(filters?: RFQFilters) {
  return useQuery({
    queryKey: ['rfqs', filters],
    queryFn: () => rfqService.getAll(filters),
  })
}

export function useRFQ(id: string) {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: () => rfqService.getById(id),
    enabled: !!id,
  })
}

export function useRFQStats() {
  return useQuery({
    queryKey: ['rfq-stats'],
    queryFn: () => rfqService.getStats(),
  })
}

export function useCreateRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<RFQ>) => rfqService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ created successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to create RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useUpdateRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RFQ> }) =>
      rfqService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useDeleteRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rfqService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ deleted successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to delete RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useSubmitRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rfqService.submit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ submitted for approval')
    },
    onError: (error: any) => {
      toast.error('Failed to submit RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useApproveRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => rfqService.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ approved successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to approve RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useRejectRFQ() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rfqService.reject(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
      queryClient.invalidateQueries({ queryKey: ['rfq', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['rfq-stats'] })
      toast.success('RFQ rejected')
    },
    onError: (error: any) => {
      toast.error('Failed to reject RFQ', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}
