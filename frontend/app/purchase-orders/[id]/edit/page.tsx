'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { usePurchaseOrder } from '@/hooks/usePurchaseOrders'

export default function EditPurchaseOrderPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: po, isLoading } = usePurchaseOrder(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Purchase Order</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{po?.title || 'Purchase Order'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Edit form coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
