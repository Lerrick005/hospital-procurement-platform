'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  ShoppingBag,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  AlertTriangle,
  Calendar,
  FileText,
  UserCheck,
  UserX,
  ArrowRight,
  Shield,
} from 'lucide-react'
import { useProcurements, useDeleteProcurement, useProcurementStats } from '@/hooks/useProcurements'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function ProcurementPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  
  const { data: procurements, isLoading, refetch } = useProcurements({ 
    search,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })
  const { data: stats, isLoading: statsLoading } = useProcurementStats()
  const deleteMutation = useDeleteProcurement()

  // Calculate department budgets
  const departmentBudgets = useMemo(() => {
    if (!procurements) return []
    const deptMap = new Map()
    procurements.forEach(p => {
      if (!deptMap.has(p.department)) {
        deptMap.set(p.department, { total: 0, spent: 0, count: 0 })
      }
      const dept = deptMap.get(p.department)
      dept.total += p.budget || 0
      dept.spent += p.spent || 0
      dept.count += 1
    })
    return Array.from(deptMap.entries()).map(([name, data]) => ({
      name,
      ...data,
      utilization: data.total > 0 ? (data.spent / data.total) * 100 : 0
    }))
  }, [procurements])

  // Get unique departments for filter
  const departments = useMemo(() => {
    if (!procurements) return []
    return [...new Set(procurements.map(p => p.department))].filter(Boolean)
  }, [procurements])

  if (isLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading procurement data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Procurement</h1>
              <p className="text-sm text-muted-foreground">
                Budget approval workflow and department spending
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push('/procurement/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Cards - Focus on Budget & Approvals */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.pending || 0}</p>
              <p className="text-xs text-muted-foreground">Awaiting Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalBudget || 0)}</p>
              <p className="text-xs text-muted-foreground">Total Budget</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.approved || 0}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Budget Utilization - Unique to Procurement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Budget Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departmentBudgets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No department data available</p>
            ) : (
              departmentBudgets.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>
                      {formatCurrency(dept.spent)} / {formatCurrency(dept.total)}
                      <span className={cn(
                        'ml-2 text-xs font-medium',
                        dept.utilization > 80 ? 'text-red-500' : 
                        dept.utilization > 60 ? 'text-yellow-500' : 
                        'text-emerald-500'
                      )}>
                        ({dept.utilization.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <Progress 
                    value={dept.utilization} 
                    className={cn(
                      'h-2',
                      dept.utilization > 80 ? 'bg-red-500/20' : 
                      dept.utilization > 60 ? 'bg-yellow-500/20' : 
                      'bg-emerald-500/20'
                    )}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search procurement requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Procurement List with Approval Workflow Status */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Approval Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!procurements || procurements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No procurement requests found</p>
                    <Button onClick={() => router.push('/procurement/new')} variant="link">
                      Create your first request
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                procurements.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{proc.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {proc.description || 'No description'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{proc.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{formatCurrency(proc.budget || 0)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress 
                            value={proc.budget > 0 ? (proc.spent / proc.budget) * 100 : 0} 
                            className="h-1.5 w-16 bg-muted/30"
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {proc.budget > 0 ? Math.round((proc.spent / proc.budget) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          proc.status === 'draft' && 'bg-gray-500/10 text-gray-600',
                          proc.status === 'pending' && 'bg-yellow-500/10 text-yellow-600',
                          proc.status === 'approved' && 'bg-blue-500/10 text-blue-600',
                          proc.status === 'rejected' && 'bg-red-500/10 text-red-600',
                          proc.status === 'completed' && 'bg-emerald-500/10 text-emerald-600',
                        )}>
                          {proc.status === 'draft' && <FileText className="h-3 w-3 mr-1" />}
                          {proc.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {proc.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {proc.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {proc.status === 'completed' && <ShoppingBag className="h-3 w-3 mr-1" />}
                          {proc.status}
                        </Badge>
                        {proc.status === 'pending' && (
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Awaiting approval
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        proc.priority === 'low' && 'text-gray-500',
                        proc.priority === 'medium' && 'text-blue-500',
                        proc.priority === 'high' && 'text-orange-500',
                        proc.priority === 'critical' && 'text-red-500',
                      )}>
                        {proc.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(proc.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/procurement/${proc.id}`)}>
                            <Eye className="h-4 w-4 mr-2" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/procurement/${proc.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {proc.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="text-emerald-600">
                                <CheckCircle className="h-4 w-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
