'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  Plus,
  Activity,
  CheckCircle,
  XCircle,
  Package,
  Loader2,
  Eye,
  Download,
  Filter,
} from 'lucide-react'
import { formatCurrency, formatNumber, formatDate, formatTimeAgo } from '@/lib/formatters'
import { useAuth } from '@/hooks/useAuth'
import { useProcurements, useProcurementStats } from '@/hooks/useProcurements'
import { useSuppliers } from '@/hooks/useSuppliers'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const { data: procurements, isLoading: procurementsLoading } = useProcurements()
  const { data: stats, isLoading: statsLoading } = useProcurementStats()
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers()

  const isLoading = procurementsLoading || statsLoading || suppliersLoading

  const metrics = useMemo(() => {
    if (!procurements || !stats || !suppliers) {
      return {
        totalSpend: 0,
        totalBudget: 0,
        pendingApprovals: 0,
        activeSuppliers: 0,
        totalProcurements: 0,
        approvedCount: 0,
        rejectedCount: 0,
        completionRate: 0,
        recentActivity: [],
        pendingOrders: 0,
        deliveredOrders: 0,
        inProgressOrders: 0,
      }
    }

    const totalSpend = procurements.reduce((sum, p) => sum + (p.spent || 0), 0)
    const totalBudget = stats.totalBudget || 0
    const pendingApprovals = stats.pending || 0
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length
    const totalProcurements = procurements.length
    const approvedCount = procurements.filter(p => p.status === 'approved').length
    const rejectedCount = procurements.filter(p => p.status === 'rejected').length
    const pendingOrders = procurements.filter(p => p.status === 'pending').length
    const deliveredOrders = procurements.filter(p => p.status === 'completed').length
    const inProgressOrders = procurements.filter(p => p.status === 'approved').length
    const completionRate = totalProcurements > 0 
      ? Math.round((procurements.filter(p => p.status === 'completed').length / totalProcurements) * 100)
      : 0

    const recentActivity = [...procurements]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        orderNumber: 'PO-' + p.id.slice(0, 8).toUpperCase(),
        title: p.title,
        amount: p.budget,
        department: p.department,
        time: new Date(p.createdAt),
        status: p.status,
        priority: p.priority,
      }))

    return {
      totalSpend,
      totalBudget,
      pendingApprovals,
      activeSuppliers,
      totalProcurements,
      approvedCount,
      rejectedCount,
      completionRate,
      pendingOrders,
      deliveredOrders,
      inProgressOrders,
      recentActivity,
    }
  }, [procurements, stats, suppliers])

  const kpiData = [
    {
      label: 'Total Revenue',
      value: metrics.totalSpend,
      change: '+2.67%',
      trend: 'up',
      icon: DollarSign,
      format: 'currency',
    },
    {
      label: 'Total Orders',
      value: metrics.totalProcurements,
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBag,
    },
    {
      label: 'Net Profit',
      value: metrics.totalBudget - metrics.totalSpend,
      change: '+5.67%',
      trend: 'up',
      icon: TrendingUp,
      format: 'currency',
    },
    {
      label: 'Active Suppliers',
      value: metrics.activeSuppliers,
      change: '+8.2%',
      trend: 'up',
      icon: Users,
    },
  ]

  const orderStats = [
    { label: 'New Orders', value: metrics.pendingOrders, color: 'text-blue-600' },
    { label: 'Wait Accepting', value: metrics.totalProcurements - metrics.pendingOrders - metrics.deliveredOrders, color: 'text-yellow-600' },
    { label: 'On Way', value: metrics.inProgressOrders, color: 'text-orange-600' },
    { label: 'Delivered', value: metrics.deliveredOrders, color: 'text-emerald-600' },
  ]

  const categoryData = [
    { name: 'Medical Equipment', percentage: 35, color: 'bg-blue-600' },
    { name: 'Pharmaceuticals', percentage: 25, color: 'bg-emerald-600' },
    { name: 'Surgical Supplies', percentage: 20, color: 'bg-purple-600' },
    { name: 'Lab Equipment', percentage: 12, color: 'bg-orange-600' },
    { name: 'Other', percentage: 8, color: 'bg-gray-600' },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-healthcare-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button onClick={() => router.push('/procurement/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Procurement
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          const formattedValue = kpi.format === 'currency' 
            ? formatCurrency(kpi.value) 
            : formatNumber(kpi.value)
          
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-soft-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                      <p className="text-3xl font-bold tracking-tight mt-2">{formattedValue}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {kpi.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground">This month vs last</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-healthcare-primary/10">
                      <Icon className="h-5 w-5 text-healthcare-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Order Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {orderStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={cn('text-3xl font-bold mt-2', stat.color)}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sales by Category */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: category.percentage + '%' }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                      className={cn('h-full rounded-full', category.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                <span className="text-xl font-bold">{metrics.totalProcurements}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Pending Orders</p>
                    <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-yellow-600">{metrics.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">Completed Orders</p>
                    <p className="text-xs text-muted-foreground">Successfully delivered</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-emerald-600">{metrics.deliveredOrders}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest procurement orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.push('/procurement')}>
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {metrics.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted-foreground p-3">Order Number</th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-3">Title</th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-3">Price</th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-3">Date</th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-right text-sm font-medium text-muted-foreground p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentActivity.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 text-sm font-medium">{order.orderNumber}</td>
                      <td className="p-3 text-sm">{order.title}</td>
                      <td className="p-3 text-sm font-medium">{formatCurrency(order.amount)}</td>
                      <td className="p-3 text-sm text-muted-foreground">{formatDate(order.time)}</td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            order.status === 'pending' && 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
                            order.status === 'approved' && 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                            order.status === 'completed' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                            order.status === 'rejected' && 'bg-red-500/10 text-red-600 border-red-500/20',
                            order.status === 'draft' && 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => router.push('/procurement/' + order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
