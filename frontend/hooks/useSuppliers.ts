import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierService } from '@/services/api/suppliers'
import { Supplier, SupplierFilters } from '@/types/suppliers'
import { toast } from 'sonner'

export function useSuppliers(filters?: SupplierFilters) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => supplierService.getAll(filters),
  })
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierService.getById(id),
    enabled: !!id,
  })
}

export function useSupplierStats() {
  return useQuery({
    queryKey: ['supplier-stats'],
    queryFn: () => supplierService.getStats(),
  })
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Supplier>) => supplierService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier-stats'] })
      toast.success('Supplier created successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to create supplier', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      supplierService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['supplier-stats'] })
      toast.success('Supplier updated successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to update supplier', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['supplier-stats'] })
      toast.success('Supplier deleted successfully')
    },
    onError: (error: any) => {
      toast.error('Failed to delete supplier', {
        description: error.response?.data?.message || 'Please try again',
      })
    },
  })
}
