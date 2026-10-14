'use client'

import { useRouter } from 'next/navigation'
import { useProcurement } from '@/hooks/useProcurements'
import { ProcurementDetail } from '@/components/procurement/ProcurementDetail'
import { useDeleteProcurement } from '@/hooks/useProcurements'
import { Loader2 } from 'lucide-react'

interface Props {
  params: {
    id: string
  }
}

export default function ProcurementDetailPage({ params }: Props) {
  const router = useRouter()
  const { data: procurement, isLoading } = useProcurement(params.id)
  const deleteProcurement = useDeleteProcurement()

  const handleDelete = async () => {
    try {
      await deleteProcurement.mutateAsync(params.id)
      router.push('/procurement')
    } catch (error) {
      console.error('Failed to delete procurement:', error)
    }
  }

  const handleApprove = () => {
    console.log('Approve procurement:', params.id)
  }

  const handleReject = () => {
    console.log('Reject procurement:', params.id)
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
        <p className="text-muted-foreground mt-2">The procurement you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ProcurementDetail 
        procurement={procurement}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}