'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  GitBranch,
  Share2,
  Package,
  Plus
} from 'lucide-react'
import { formatCurrency, formatDate, formatTimeAgo } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface ProcurementTableProps {
  procurements: any[]
  onDelete: (id: string) => void
}

export function ProcurementTable({ procurements, onDelete }: ProcurementTableProps) {
  const router = useRouter()

  const statusColors: Record<string, string> = {
    draft: 'bg-secondary/20 text-secondary-foreground border-secondary/30',
    pending: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
    approved: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-600 border-red-500/30',
    completed: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  }

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-500/20 text-gray-600',
    medium: 'bg-blue-500/20 text-blue-600',
    high: 'bg-orange-500/20 text-orange-600',
    critical: 'bg-red-500/20 text-red-600',
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      draft: Clock,
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      completed: CheckCircle,
    }
    return icons[status] || Clock
  }

  if (procurements.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">No procurements found</p>
              <p className="text-sm text-muted-foreground/70">Create your first procurement to get started</p>
            </div>
            <Button 
              onClick={() => router.push('/procurement/new')} 
              variant="outline" 
              size="sm" 
              className="mt-2 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Procurement
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/5">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="font-medium">
            {procurements.length} Items
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-emerald-600">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Updated: {formatTimeAgo(new Date())}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>Auto-refresh</span>
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20 hover:bg-muted/20 border-b border-border/50">
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Procurement
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Department
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Budget
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Priority
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Due Date
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {procurements.map((procurement, index) => {
                const StatusIcon = getStatusIcon(procurement.status)
                return (
                  <motion.tr
                    key={procurement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-muted/20 transition-colors duration-200 border-b border-border/30"
                  >
                    <TableCell className="py-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-healthcare-primary to-healthcare-accent opacity-50" />
                          <div>
                            <p className="font-medium text-sm">{procurement.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                              {procurement.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal bg-muted/20">
                        {procurement.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-sm">{formatCurrency(procurement.budget)}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress 
                            value={Math.min((procurement.spent / procurement.budget) * 100, 100)} 
                            className="h-1.5 w-20 bg-muted/30"
                          />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {Math.round((procurement.spent / procurement.budget) * 100)}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('border font-medium', statusColors[procurement.status])}>
                        <StatusIcon className="h-3 w-3 mr-1.5" />
                        {procurement.status.charAt(0).toUpperCase() + procurement.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('font-medium', priorityColors[procurement.priority])}>
                        {procurement.priority.charAt(0).toUpperCase() + procurement.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {procurement.dueDate ? (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(procurement.dueDate)}
                        </span>
                      ) : (
                        '—'
                      )}
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
                          <DropdownMenuItem onClick={() => router.push(/procurement/)} className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(/procurement//edit)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <GitBranch className="h-4 w-4" />
                            Workflow
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          {procurement.status === 'pending' && (
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
                            onClick={() => onDelete(procurement.id)}
                            className="gap-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
