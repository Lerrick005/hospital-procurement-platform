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
import { useCreateRFQ } from '@/hooks/useRFQ'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/formatters'

const rfqSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  budgetEstimate: z.number().min(0, 'Budget must be 0 or more'),
  submissionDeadline: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().default('pcs'),
    estimatedPrice: z.number().min(0, 'Estimated price must be 0 or more'),
  })).min(1, 'At least one item is required'),
})

type RFQFormData = z.infer<typeof rfqSchema>

export default function NewRFQPage() {
  const router = useRouter()
  const createMutation = useCreateRFQ()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      items: [{ name: '', quantity: 1, unit: 'pcs', estimatedPrice: 0 }],
      priority: 'medium',
      budgetEstimate: 0,
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const items = watch('items')
  const totalBudget = items?.reduce((sum, item) => sum + (item.quantity || 0) * (item.estimatedPrice || 0), 0) || 0

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true)
    try {
      await createMutation.mutateAsync({
        ...data,
        budgetEstimate: totalBudget,
        requestedBy: user?.id || '00000000-0000-0000-0000-000000000001',
        requestedByName: user?.name || 'Test User',
      })
      toast.success('RFQ created successfully!')
      router.push('/rfq')
    } catch (error) {
      toast.error('Failed to create RFQ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create RFQ</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RFQ Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input {...register('title')} placeholder="Enter RFQ title" />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea {...register('description')} placeholder="Describe what you're requesting" rows={3} />
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
                  <Label>Submission Deadline</Label>
                  <Input {...register('submissionDeadline')} type="date" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Items Requested</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', quantity: 1, unit: 'pcs', estimatedPrice: 0 })}>
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
                          <Label>Unit</Label>
                          <Select onValueChange={(value) => setValue(`items.${index}.unit`, value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pcs">Pieces</SelectItem>
                              <SelectItem value="kg">Kilogram</SelectItem>
                              <SelectItem value="liters">Liters</SelectItem>
                              <SelectItem value="box">Box</SelectItem>
                              <SelectItem value="set">Set</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Est. Price</Label>
                          <Input {...register(`items.${index}.estimatedPrice`, { valueAsNumber: true })} type="number" min="0" step="0.01" />
                          {errors.items?.[index]?.estimatedPrice && <p className="text-sm text-red-500 mt-1">{errors.items[index].estimatedPrice?.message}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {errors.items && <p className="text-sm text-red-500">{errors.items.message}</p>}
              </CardContent>
            </Card>
          </div>

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
                  <span className="text-muted-foreground">Estimated Budget</span>
                  <span className="text-2xl font-bold text-healthcare-primary">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create RFQ'
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

