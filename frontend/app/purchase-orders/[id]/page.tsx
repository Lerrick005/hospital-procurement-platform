'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Edit, Trash2, Send, CheckCircle, XCircle } from 'lucide-react'
import { usePurchaseOrder, useDeletePurchaseOrder } from '@/hooks/usePurchaseOrders'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function PurchaseOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { data: po, isLoading } = usePurchaseOrder(id)
  const deleteMutation = useDeletePurchaseOrder()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      await deleteMutation.mutateAsync(id)
      router.push('/purchase-orders')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      approved: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
      completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-healthcare-primary" />
      </div>
    )
  }

  if (!po) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Purchase order not found</p>
        <Button onClick={() => router.push('/purchase-orders')} className="mt-4">
          Back to Purchase Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{po.title}</h1>
            <p className="text-muted-foreground">
              {po.poNumber || `PO-${String(po.id).slice(0, 8)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/purchase-orders/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge className={cn('text-lg px-4 py-2', getStatusColor(po.status))}>
          {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {po.priority.charAt(0).toUpperCase() + po.priority.slice(1)} Priority
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium">{po.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Supplier</span>
              <span className="font-medium">{po.supplierName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-healthcare-primary">
                {formatCurrency(po.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{formatDate(po.createdAt)}</span>
            </div>
            {po.expectedDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected Delivery</span>
                <span className="font-medium">{formatDate(po.expectedDeliveryDate)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {po.description && (
              <div>
                <span className="text-muted-foreground">Description</span>
                <p className="mt-1">{po.description}</p>
              </div>
            )}
            {po.budgetCode && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget Code</span>
                <span className="font-mono">{po.budgetCode}</span>
              </div>
            )}
            {po.requestedByName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested By</span>
                <span className="font-medium">{po.requestedByName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {po.items && po.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Item</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Qty</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Unit Price</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {po.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right py-2 font-medium">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-3 font-bold">Total</td>
                    <td className="text-right py-3 font-bold text-healthcare-primary">
                      {formatCurrency(po.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        {po.status === 'draft' && (
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Submit for Approval
          </Button>
        )}
        {po.status === 'pending' && (
          <>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button variant="destructive" className="gap-2">
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
