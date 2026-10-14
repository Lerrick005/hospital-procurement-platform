'use client'

import { useRouter } from 'next/navigation'
import { SupplierForm } from '@/components/suppliers/SupplierForm'
import { useSupplier, useUpdateSupplier } from '@/hooks/useSuppliers'
import { Loader2 } from 'lucide-react'

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: supplier, isLoading } = useSupplier(params.id)
  const updateSupplier = useUpdateSupplier()

  const handleSubmit = async (data: any) => {
    try {
      await updateSupplier.mutateAsync({ id: params.id, data })
      router.push('/suppliers/' + params.id)
    } catch (error) {
      console.error('Failed to update supplier:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold">Supplier not found</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SupplierForm 
        initialData={supplier}
        onSubmit={handleSubmit}
        isLoading={updateSupplier.isPending}
      />
    </div>
  )
}