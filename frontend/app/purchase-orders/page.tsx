'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Activity,
  Package,
  Send,
  Download,
  AlertCircle,
} from 'lucide-react'
import { usePurchaseOrders, useDeletePurchaseOrder, usePurchaseOrderStats } from '@/hooks/usePurchaseOrders'
import { formatCurrency, formatDate, formatTimeAgo } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function PurchaseOrdersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  
  const { data: purchaseOrders, isLoading, refetch } = usePurchaseOrders({ 
    search,
    status: selectedStatus || undefined,
    priority: selectedPriority || undefined
  })
  const { data: stats, isLoading: statsLoading } = usePurchaseOrderStats()
  const deleteMutation = useDeletePurchaseOrder()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      await deleteMutation.mutateAsync(id)
      refetch()
    }
  }

  const statsCards = [
    {
      label: 'Total Orders',
      value: stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500/10 text-blue-600',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Pending Approval',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500/10 text-yellow-600',
      change: '-3%',
      trend: 'down',
    },
    {
      label: 'Total Value',
      value: stats?.totalValue || 0,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600',
      change: '+8%',
      trend: 'up',
      format: 'currency',
    },
    {
      label: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: 'bg-purple-500/10 text-purple-600',
      change: '+15%',
      trend: 'up',
    },
  ]

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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500/10 text-gray-600',
      medium: 'bg-blue-500/10 text-blue-600',
      high: 'bg-orange-500/10 text-orange-600',
      critical: 'bg-red-500/10 text-red-600',
    }
    return colors[priority] || 'bg-gray-500/10 text-gray-600'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      draft: FileText,
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle,
    }
    return icons[status] || Clock
  }

  if (isLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-healthcare-primary" />
        <p className="mt-4 text-muted-foreground">Loading purchase orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage all purchase orders across departments
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/purchase-orders/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          const formattedValue = stat.format === 'currency' 
            ? formatCurrency(stat.value) 
            : stat.value
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -4 }}
            >
              <Card className="hover:shadow-soft-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold tracking-tight mt-2">{formattedValue}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span className={cn(
                          'text-xs font-medium',
                          stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                        )}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    </div>
                    <div className={cn('rounded-xl p-3', stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={!selectedStatus && !selectedPriority ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSelectedStatus(null)
            setSelectedPriority(null)
          }}
          className="rounded-full px-4"
        >
          All
          <span className="ml-1.5 text-xs opacity-60">({purchaseOrders?.length || 0})</span>
        </Button>
        <Select
          value={selectedStatus || ''}
          onValueChange={(value) => setSelectedStatus(value || null)}
        >
          <SelectTrigger className="w-[140px] h-9 rounded-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={selectedPriority || ''}
          onValueChange={(value) => setSelectedPriority(value || null)}
        >
          <SelectTrigger className="w-[140px] h-9 rounded-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        {(selectedStatus || selectedPriority) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedStatus(null)
              setSelectedPriority(null)
            }}
            className="text-muted-foreground"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchase orders by title, PO number, or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/20 border-border/50 focus-visible:bg-background transition-all h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 w-8 p-0 rounded-md"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0 rounded-md"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="font-medium">
                  {purchaseOrders?.length || 0} Orders
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Total Value: {formatCurrency(stats?.totalValue || 0)}
              </div>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">PO #</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Title</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Supplier</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Amount</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Priority</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Date</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!purchaseOrders || purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <FileText className="h-12 w-12 text-muted-foreground/30" />
                          <p className="text-lg font-medium text-muted-foreground">No purchase orders found</p>
                          <p className="text-sm text-muted-foreground/70">Create your first purchase order to get started</p>
                          <Button onClick={() => router.push('/purchase-orders/new')} variant="outline" className="mt-2 gap-2">
                            <Plus className="h-4 w-4" />
                            Create Purchase Order
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrders.map((po, index) => {
                      const StatusIcon = getStatusIcon(po.status)
                      return (
                        <motion.tr
                          key={po.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="group hover:bg-muted/20 transition-colors duration-200"
                        >
                          <TableCell className="py-4">
                            <div className="font-mono text-sm font-medium text-healthcare-primary">
                              {po.poNumber || `PO-${String(po.id).slice(0, 8)}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{po.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {po.department}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{po.supplierName || 'N/A'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-sm">{formatCurrency(po.totalAmount || 0)}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={po.status === 'completed' ? 100 : po.status === 'approved' ? 75 : po.status === 'pending' ? 50 : 25}
                                className="h-1.5 w-16 bg-muted/30"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn('border font-medium', getStatusColor(po.status))}>
                              <StatusIcon className="h-3 w-3 mr-1.5" />
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('font-medium', getPriorityColor(po.priority))}>
                              {po.priority.charAt(0).toUpperCase() + po.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(po.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/purchase-orders/${po.id}`)}>
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/purchase-orders/${po.id}/edit`)}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                {po.status === 'draft' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 text-blue-600">
                                      <Send className="h-4 w-4" />
                                      Submit for Approval
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {po.status === 'pending' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 text-emerald-600">
                                      <CheckCircle className="h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 text-red-600">
                                      <XCircle className="h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(po.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {!purchaseOrders || purchaseOrders.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <FileText className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">No purchase orders found</p>
              </div>
            </div>
          ) : (
            purchaseOrders.map((po, index) => {
              const StatusIcon = getStatusIcon(po.status)
              return (
                <motion.div
                  key={po.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="group hover:shadow-soft-lg transition-all duration-300 border-border/50 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{po.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-healthcare-primary">
                              {po.poNumber || `PO-${String(po.id).slice(0, 8)}`}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {po.department}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={cn('shrink-0', getStatusColor(po.status))}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {po.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Supplier</span>
                          <span className="font-medium">{po.supplierName || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-semibold text-healthcare-primary">
                            {formatCurrency(po.totalAmount || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Priority</span>
                          <Badge variant="outline" className={cn('font-medium text-xs', getPriorityColor(po.priority))}>
                            {po.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-xs">{formatDate(po.createdAt)}</span>
                        </div>
                        <div className="pt-3 flex items-center justify-between border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/purchase-orders/${po.id}`)}
                            className="text-xs gap-1 hover:gap-2 transition-all"
                          >
                            View Details
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/purchase-orders/${po.id}`)}>
                                <Eye className="h-3 w-3 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/purchase-orders/${po.id}/edit`)}>
                                <Edit className="h-3 w-3 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(po.id)}>
                                <Trash2 className="h-3 w-3 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </motion.div>
      )}
    </div>
  )
}
