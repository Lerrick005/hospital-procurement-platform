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
  UserPlus,
  Building2,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  Star,
  StarHalf,
  Download,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Activity,
  Package,
} from 'lucide-react'
import { useSuppliers, useDeleteSupplier } from '@/hooks/useSuppliers'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function SuppliersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const { data: suppliers, isLoading, refetch } = useSuppliers({ 
    search,
    category: selectedCategory || undefined,
    status: selectedStatus || undefined
  })
  const deleteMutation = useDeleteSupplier()

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      await deleteMutation.mutateAsync(id)
      refetch()
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    if (!suppliers || suppliers.length === 0) {
      return {
        total: 0,
        active: 0,
        pending: 0,
        avgRating: 0,
        totalSpend: 0,
      }
    }
    const total = suppliers.length
    const active = suppliers.filter(s => s.status === 'active').length
    const pending = suppliers.filter(s => s.status === 'pending').length
    const avgRating = suppliers.reduce((acc, s) => acc + (s.rating || 0), 0) / total
    const totalSpend = suppliers.reduce((acc, s) => acc + (s.totalSpend || 0), 0)
    return { total, active, pending, avgRating, totalSpend }
  }, [suppliers])

  // Get unique categories for filter
  const categories = useMemo(() => {
    if (!suppliers) return []
    return [...new Set(suppliers.map(s => s.category))].filter(Boolean)
  }, [suppliers])

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />)
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3.5 w-3.5 text-gray-300" />)
    }
    return stars
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      suspended: 'bg-red-500/10 text-red-600 border-red-500/20',
    }
    return colors[status] || 'bg-gray-500/10 text-gray-600'
  }

  const statsCards = [
    {
      label: 'Total Suppliers',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    {
      label: 'Active Suppliers',
      value: stats.active,
      icon: CheckCircle,
      color: 'bg-emerald-500/10 text-emerald-600',
      trend: '+8%',
      trendUp: true,
    },
    {
      label: 'Pending Approval',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500/10 text-yellow-600',
      trend: '-3%',
      trendUp: false,
    },
    {
      label: 'Avg Rating',
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: 'bg-purple-500/10 text-purple-600',
      trend: '+0.4',
      trendUp: true,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-healthcare-primary" />
        <p className="mt-4 text-muted-foreground">Loading suppliers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1">
            Manage supplier relationships and performance
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/suppliers/new')} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
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
                      <p className="text-2xl font-bold tracking-tight mt-2">{stat.value}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {stat.trendUp ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span className={cn(
                          'text-xs font-medium',
                          stat.trendUp ? 'text-emerald-500' : 'text-red-500'
                        )}>
                          {stat.trend}
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
          variant={!selectedStatus && !selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setSelectedStatus(null)
            setSelectedCategory(null)
          }}
          className="rounded-full px-4"
        >
          All
          <span className="ml-1.5 text-xs opacity-60">({suppliers?.length || 0})</span>
        </Button>
        <Select
          value={selectedCategory || ''}
          onValueChange={(value) => setSelectedCategory(value || null)}
        >
          <SelectTrigger className="w-[160px] h-9 rounded-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedStatus || ''}
          onValueChange={(value) => setSelectedStatus(value || null)}
        >
          <SelectTrigger className="w-[140px] h-9 rounded-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        {(selectedCategory || selectedStatus) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory(null)
              setSelectedStatus(null)
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
            placeholder="Search suppliers by name, email, or category..."
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
                  {suppliers?.length || 0} Suppliers
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Total Spend: {formatCurrency(stats.totalSpend)}
              </div>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Supplier</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Category</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Rating</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Total Spend</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                    <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!suppliers || suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-4">
                          <Building2 className="h-12 w-12 text-muted-foreground/30" />
                          <p className="text-lg font-medium text-muted-foreground">No suppliers found</p>
                          <p className="text-sm text-muted-foreground/70">Add your first supplier to get started</p>
                          <Button onClick={() => router.push('/suppliers/new')} variant="outline" className="mt-2 gap-2">
                            <Plus className="h-4 w-4" />
                            Add Supplier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier, index) => (
                      <motion.tr
                        key={supplier.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-muted/20 transition-colors duration-200"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-healthcare-primary/10 flex items-center justify-center text-healthcare-primary font-semibold">
                              {getInitials(supplier.name)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{supplier.name}</p>
                              <p className="text-xs text-muted-foreground">{supplier.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-muted/20 font-normal">
                            {supplier.category || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {renderStars(supplier.rating || 0)}
                            <span className="ml-1 text-sm font-medium">{supplier.rating?.toFixed(1) || '0'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-sm">{formatCurrency(supplier.totalSpend || 0)}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress 
                                value={Math.min((supplier.totalSpend / (stats.totalSpend || 1)) * 100, 100)} 
                                className="h-1.5 w-20 bg-muted/30"
                              />
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {Math.round((supplier.totalSpend / (stats.totalSpend || 1)) * 100)}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn('border font-medium', getStatusColor(supplier.status))}>
                            {supplier.status}
                          </Badge>
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
                              <DropdownMenuItem onClick={() => router.push(`/suppliers/${supplier.id}`)}>
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(supplier.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
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
          {!suppliers || suppliers.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <Building2 className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-muted-foreground">No suppliers found</p>
              </div>
            </div>
          ) : (
            suppliers.map((supplier, index) => (
              <motion.div
                key={supplier.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -4 }}
              >
                <Card className="group hover:shadow-soft-lg transition-all duration-300 border-border/50 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-full bg-healthcare-primary/10 flex items-center justify-center text-healthcare-primary font-semibold shrink-0">
                          {getInitials(supplier.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-semibold truncate">{supplier.name}</CardTitle>
                          <p className="text-xs text-muted-foreground truncate">{supplier.email}</p>
                        </div>
                      </div>
                      <Badge className={cn('shrink-0', getStatusColor(supplier.status))}>
                        {supplier.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline" className="font-normal">
                          {supplier.category || 'General'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <div className="flex items-center gap-1">
                          {renderStars(supplier.rating || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Spend</span>
                          <span className="font-semibold">{formatCurrency(supplier.totalSpend || 0)}</span>
                        </div>
                        <Progress 
                          value={Math.min((supplier.totalSpend / (stats.totalSpend || 1)) * 100, 100)} 
                          className="h-1.5 mt-1.5 bg-muted/30"
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Contracts</span>
                        <span className="font-medium">{supplier.contracts || 0}</span>
                      </div>
                      <div className="pt-3 flex items-center justify-between border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/suppliers/${supplier.id}`)}
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
                            <DropdownMenuItem onClick={() => router.push(`/suppliers/${supplier.id}`)}>
                              <Eye className="h-3 w-3 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/suppliers/${supplier.id}/edit`)}>
                              <Edit className="h-3 w-3 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(supplier.id)}>
                              <Trash2 className="h-3 w-3 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  )
}
