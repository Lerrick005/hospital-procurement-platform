'use client'

import { useRouter } from 'next/navigation'
import { ProcurementForm } from '@/components/procurement/ProcurementForm'
import { useProcurement, useUpdateProcurement } from '@/hooks/useProcurements'
import { Loader2 } from 'lucide-react'

interface Props {
  params: {
    id: string
  }
}

export default function EditProcurementPage({ params }: Props) {
  const router = useRouter()
  const { data: procurement, isLoading } = useProcurement(params.id)
  const updateProcurement = useUpdateProcurement()

  const handleSubmit = async (data: any) => {
    try {
      await updateProcurement.mutateAsync({ id: params.id, data })
      router.push('/procurement/' + params.id)
    } catch (error) {
      console.error('Failed to update procurement:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    )
  }

  if (!procurement) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold">Procurement not found</h2>
        <p className="text-muted-foreground mt-2">The procurement you're trying to edit doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ProcurementForm 
        initialData={procurement}
        onSubmit={handleSubmit}
        isLoading={updateProcurement.isPending}
      />
    </div>
  )
}