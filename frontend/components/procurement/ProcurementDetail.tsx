'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Building2,
  DollarSign,
  Package,
  FileText,
  MessageSquare,
  Share2,
  Download,
  Printer,
  GitBranch,
  Users,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface ProcurementDetailProps {
  procurement: any
  onDelete: () => void
  onApprove: () => void
  onReject: () => void
}

export function ProcurementDetail({ procurement, onDelete, onApprove, onReject }: ProcurementDetailProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const statusColors: Record<string, string> = {
    draft: 'bg-secondary/20 text-secondary-foreground',
    pending: 'bg-yellow-500/20 text-yellow-600',
    approved: 'bg-emerald-500/20 text-emerald-600',
    rejected: 'bg-red-500/20 text-red-600',
    completed: 'bg-blue-500/20 text-blue-600',
  }

  const statusIcons: Record<string, any> = {
    draft: Clock,
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    completed: CheckCircle,
  }

  const StatusIcon = statusIcons[procurement.status] || Clock

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{procurement.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={cn('border', statusColors[procurement.status])}>
                <StatusIcon className="h-3 w-3 mr-1.5" />
                {procurement.status.charAt(0).toUpperCase() + procurement.status.slice(1)}
              </Badge>
              <Badge variant="outline">{procurement.priority}</Badge>
              <span className="text-sm text-muted-foreground">
                {procurement.department}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          {procurement.status === 'pending' && (
            <>
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={onApprove}>
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" className="gap-2" onClick={onReject}>
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={() => router.push(/procurement//edit)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-xl font-bold">{formatCurrency(procurement.budget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-xl font-bold">{formatCurrency(procurement.spent || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-xl font-bold">
                  {Math.round((procurement.spent / procurement.budget) * 100)}%
                </p>
                <Progress 
                  value={Math.min((procurement.spent / procurement.budget) * 100, 100)} 
                  className="h-1.5 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-xl font-bold">
                  {procurement.dueDate ? formatDate(procurement.dueDate) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg px-4">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="items" className="rounded-lg px-4">
            <Package className="h-4 w-4 mr-2" />
            Items
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg px-4">
            <GitBranch className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="comments" className="rounded-lg px-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {procurement.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">{procurement.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="font-medium">{procurement.assignedTo || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(procurement.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">{formatDate(procurement.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Procurement Items</CardTitle>
              <CardDescription>List of items included in this procurement</CardDescription>
            </CardHeader>
            <CardContent>
              {procurement.items && procurement.items.length > 0 ? (
                <div className="space-y-3">
                  {procurement.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.total)}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No items added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
              <CardDescription>Track all activities for this procurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-healthcare-primary" />
                  <div>
                    <p className="text-sm font-medium">Procurement Created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(procurement.createdAt)}</p>
                  </div>
                </div>
                {procurement.status === 'approved' && (
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-sm font-medium">Procurement Approved</p>
                      <p className="text-xs text-muted-foreground">{formatDate(procurement.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {procurement.status === 'rejected' && (
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-red-500" />
                    <div>
                      <p className="text-sm font-medium">Procurement Rejected</p>
                      <p className="text-xs text-muted-foreground">{formatDate(procurement.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comments</CardTitle>
              <CardDescription>Collaborate with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                  <div className="h-8 w-8 rounded-full bg-healthcare-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-healthcare-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">System</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                    <p className="text-sm text-muted-foreground">No comments yet. Start the conversation!</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
