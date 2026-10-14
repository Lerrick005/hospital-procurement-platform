'use client'

import { useRouter } from 'next/navigation'
import { useSupplier, useDeleteSupplier } from '@/hooks/useSuppliers'
import { Loader2, ArrowLeft, Edit, Trash2, Mail, Phone, Building2, Globe, MapPin, Star, DollarSign, FileText, Users, Award, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: supplier, isLoading } = useSupplier(params.id)
  const deleteSupplier = useDeleteSupplier()

  const getStatusColors = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-600',
      inactive: 'bg-gray-500/10 text-gray-600',
      pending: 'bg-yellow-500/10 text-yellow-600',
      suspended: 'bg-red-500/10 text-red-600',
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      active: CheckCircle,
      inactive: XCircle,
      pending: Clock,
      suspended: AlertCircle,
    }
    return icons[status] || Clock
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      await deleteSupplier.mutateAsync(params.id)
      router.push('/suppliers')
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
        <Building2 className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold mt-4">Supplier not found</h2>
        <Button onClick={() => router.push('/suppliers')} className="mt-4">Back to Suppliers</Button>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(supplier.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-healthcare-primary/10 text-healthcare-primary text-2xl font-semibold">
                {getInitials(supplier.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{supplier.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge className={cn('border', getStatusColors(supplier.status))}>
                  <StatusIcon className="h-3 w-3 mr-1.5" />
                  {supplier.status}
                </Badge>
                <Badge variant="outline">{supplier.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{supplier.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/suppliers/' + supplier.id + '/edit')}>
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-500" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-xl font-bold">{formatCurrency(supplier.totalSpend)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Contracts</p>
                <p className="text-xl font-bold">{supplier.contracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-xl font-bold">{supplier.rating.toFixed(1)} / 5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-xl font-bold">{formatDate(supplier.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{supplier.category}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{supplier.address || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-sm text-muted-foreground">{supplier.website || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{supplier.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{supplier.phone || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>On-Time Delivery</span>
              <span>{supplier.performance?.onTimeDelivery || 0}%</span>
            </div>
            <Progress value={supplier.performance?.onTimeDelivery || 0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Quality Score</span>
              <span>{supplier.performance?.qualityScore || 0}%</span>
            </div>
            <Progress value={supplier.performance?.qualityScore || 0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Response Time</span>
              <span>{supplier.performance?.responseTime || 0}%</span>
            </div>
            <Progress value={supplier.performance?.responseTime || 0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Cost Competitiveness</span>
              <span>{supplier.performance?.costCompetitiveness || 0}%</span>
            </div>
            <Progress value={supplier.performance?.costCompetitiveness || 0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Compliance</span>
              <span>{supplier.performance?.compliance || 0}%</span>
            </div>
            <Progress value={supplier.performance?.compliance || 0} className="h-2" />
          </div>
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Performance</span>
              <Badge className="bg-emerald-500/10 text-emerald-600">
                {supplier.performance?.overall || 0}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}