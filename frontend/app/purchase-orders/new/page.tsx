'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import { useCreatePurchaseOrder } from '@/hooks/usePurchaseOrders'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

const poSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  supplierId: z.string().min(1, 'Supplier is required'),
  supplierName: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  expectedDeliveryDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be 0 or more'),
    unit: z.string().default('pcs'),
  })).min(1, 'At least one item is required'),
})

type POFormData = z.infer<typeof poSchema>

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const createMutation = useCreatePurchaseOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      items: [{ name: '', quantity: 1, unitPrice: 0, unit: 'pcs' }],
      priority: 'medium'
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const items = watch('items')
  const totalAmount = items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0) || 0

  const onSubmit = async (data: POFormData) => {
    setIsSubmitting(true)
    try {
      await createMutation.mutateAsync({
        ...data,
        totalAmount,
        requestedBy: 'current-user-id', // Replace with actual user ID
        requestedByName: 'Current User', // Replace with actual user name
      })
      toast.success('Purchase order created successfully!')
      router.push('/purchase-orders')
    } catch (error) {
      toast.error('Failed to create purchase order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Purchase Order</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input {...register('title')} placeholder="Enter purchase order title" />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea {...register('description')} placeholder="Brief description of the purchase" rows={3} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Department *</Label>
                    <Select onValueChange={(value) => setValue('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Expected Delivery Date</Label>
                  <Input {...register('expectedDeliveryDate')} type="date" />
                </div>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', quantity: 1, unitPrice: 0, unit: 'pcs' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">Item #{index + 1}</span>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="text-red-600" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <Label>Item Name *</Label>
                        <Input {...register(`items.${index}.name`)} placeholder="Enter item name" />
                        {errors.items?.[index]?.name && <p className="text-sm text-red-500 mt-1">{errors.items[index].name?.message}</p>}
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <Label>Quantity</Label>
                          <Input {...register(`items.${index}.quantity`, { valueAsNumber: true })} type="number" min="1" />
                          {errors.items?.[index]?.quantity && <p className="text-sm text-red-500 mt-1">{errors.items[index].quantity?.message}</p>}
                        </div>
                        <div>
                          <Label>Unit Price</Label>
                          <Input {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} type="number" min="0" step="0.01" />
                          {errors.items?.[index]?.unitPrice && <p className="text-sm text-red-500 mt-1">{errors.items[index].unitPrice?.message}</p>}
                        </div>
                        <div>
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 border rounded-md bg-muted/20 font-medium">
                            {formatCurrency((watch(`items.${index}.quantity`) || 0) * (watch(`items.${index}.unitPrice`) || 0))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {errors.items && <p className="text-sm text-red-500">{errors.items.message}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-semibold">{fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-2xl font-bold text-healthcare-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Purchase Order'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea {...register('notes')} placeholder="Additional notes..." rows={4} />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
