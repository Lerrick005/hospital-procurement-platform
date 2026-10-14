import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { purchaseOrderService } from '@/services/api/purchaseOrders'
import { PurchaseOrder, PurchaseOrderFilters, CreatePurchaseOrderDTO, UpdatePurchaseOrderDTO } from '@/types/purchaseOrder'
import { toast } from 'sonner'

export function usePurchaseOrders(filters?: PurchaseOrderFilters) {
  return useQuery({
    queryKey: ['purchase-orders', filters],
    queryFn: () => purchaseOrderService.getAll(filters),
  })
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-order', id],
    queryFn: () => purchaseOrderService.getById(id),
    enabled: !!id,
  })
}

export function usePurchaseOrderStats() {
  return useQuery({
    queryKey: ['purchase-order-stats'],
    queryFn: () => purchaseOrderService.getStats(),
  })
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePurchaseOrderDTO) => purchaseOrderService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] })
      toast.success('Purchase order created successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to create purchase order', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseOrderDTO }) =>
      purchaseOrderService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] })
      toast.success('Purchase order updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update purchase order', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => purchaseOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] })
      toast.success('Purchase order deleted successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to delete purchase order', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      purchaseOrderService.approve(id, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] })
      toast.success('Purchase order approved successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to approve purchase order', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useRejectPurchaseOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      purchaseOrderService.reject(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['purchase-order-stats'] })
      toast.success('Purchase order rejected')
    },
    onError: (error: any) => {
      toast.error('Failed to reject purchase order', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}
