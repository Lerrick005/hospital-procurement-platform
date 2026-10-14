'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Gavel,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Plus,
  Users,
  DollarSign,
  Clock,
  Award,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle,
  Send,
  AlertTriangle,
} from 'lucide-react'
import { useRFQs, useDeleteRFQ } from '@/hooks/useRFQ'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export default function RFQPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const { data: rfqs, isLoading, refetch } = useRFQs({ 
    search,
    status: statusFilter !== 'all' ? statusFilter : undefined
  })
  const deleteMutation = useDeleteRFQ()

  // Real-time quote tracking
  const quoteStats = useMemo(() => {
    if (!rfqs) return null
    const total = rfqs.length
    const published = rfqs.filter(r => r.status === 'published').length
    const underEvaluation = rfqs.filter(r => r.status === 'evaluating').length
    const awarded = rfqs.filter(r => r.status === 'awarded').length
    const totalBudget = rfqs.reduce((s, r) => s + (r.budgetEstimate || 0), 0)
    const awardedAmount = rfqs.reduce((s, r) => s + (r.awardedAmount || 0), 0)
    // Calculate potential savings
    const savings = totalBudget - awardedAmount
    
    return { total, published, underEvaluation, awarded, totalBudget, awardedAmount, savings }
  }, [rfqs])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      {/* Header with Purpose */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Gavel className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RFQ</h1>
              <p className="text-sm text-muted-foreground">
                Compare supplier quotes and award contracts
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => router.push('/rfq/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New RFQ
        </Button>
      </div>

      {/* Quote Stats - Different from other modules */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quoteStats?.total || 0}</p>
              <p className="text-xs text-muted-foreground">Total RFQs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quoteStats?.published || 0}</p>
              <p className="text-xs text-muted-foreground">Awaiting Quotes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quoteStats?.underEvaluation || 0}</p>
              <p className="text-xs text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Award className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quoteStats?.awarded || 0}</p>
              <p className="text-xs text-muted-foreground">Awarded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Display - Unique to RFQ */}
      {quoteStats?.savings > 0 && (
        <Card className="mb-6 border-l-4 border-l-emerald-500 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Potential Savings</p>
                <p className="text-xs text-muted-foreground">
                  Based on awarded vs estimated budget
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-emerald-500">
              {formatCurrency(quoteStats.savings)}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search RFQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="evaluating">Evaluating</SelectItem>
            <SelectItem value="awarded">Awarded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* RFQ List */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Suppliers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!rfqs || rfqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Gavel className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No RFQs found</p>
                    <Button 
                      onClick={() => router.push('/rfq/new')} 
                      variant="link"
                    >
                      Create your first RFQ
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                rfqs.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-mono text-sm text-blue-600">
                      {rfq.rfqNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rfq.title}</p>
                        <p className="text-xs text-muted-foreground">{rfq.department}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(rfq.budgetEstimate || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {(rfq.invitedSuppliers?.length || 0)} invited
                        </span>
                        <span className="text-xs text-emerald-500">
                          {rfq.receivedQuotes?.length || 0} responded
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        rfq.status === 'draft' && 'bg-gray-500/10 text-gray-600',
                        rfq.status === 'published' && 'bg-blue-500/10 text-blue-600',
                        rfq.status === 'evaluating' && 'bg-yellow-500/10 text-yellow-600',
                        rfq.status === 'awarded' && 'bg-emerald-500/10 text-emerald-600',
                      )}>
                        {rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rfq.submissionDeadline ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(rfq.submissionDeadline)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/rfq/${rfq.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/rfq/${rfq.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
