'use client'

import { useRouter } from 'next/navigation'
import { ProcurementForm } from '@/components/procurement/ProcurementForm'
import { useCreateProcurement } from '@/hooks/useProcurements'

export default function NewProcurementPage() {
  const router = useRouter()
  const createProcurement = useCreateProcurement()

  const handleSubmit = async (data: any) => {
    try {
      await createProcurement.mutateAsync(data)
      router.push('/procurement')
    } catch (error) {
      console.error('Failed to create procurement:', error)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ProcurementForm 
        onSubmit={handleSubmit}
        isLoading={createProcurement.isPending}
      />
    </div>
  )
}