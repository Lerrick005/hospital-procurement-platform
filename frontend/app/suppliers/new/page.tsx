'use client'

import { useRouter } from 'next/navigation'
import { SupplierForm } from '@/components/suppliers/SupplierForm'
import { useCreateSupplier } from '@/hooks/useSuppliers'

export default function NewSupplierPage() {
  const router = useRouter()
  const createSupplier = useCreateSupplier()

  const handleSubmit = async (data: any) => {
    try {
      await createSupplier.mutateAsync(data)
      router.push('/suppliers')
    } catch (error) {
      console.error('Failed to create supplier:', error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SupplierForm 
        onSubmit={handleSubmit}
        isLoading={createSupplier.isPending}
      />
    </div>
  )
}