'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  Package
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface ProcurementGridProps {
  procurements: any[]
  onDelete: (id: string) => void
}

export function ProcurementGrid({ procurements, onDelete }: ProcurementGridProps) {
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
      draft: '📝',
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      completed: '✔️',
    }
    return icons[status] || '📝'
  }

  if (procurements.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground">No procurements found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence>
        {procurements.map((procurement, index) => (
          <motion.div
            key={procurement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ y: -4 }}
          >
            <Card className="group hover:shadow-soft-lg transition-all duration-300 border-border/50 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold truncate">{procurement.title}</CardTitle>
                    <CardDescription className="text-xs truncate">
                      {procurement.department}
                    </CardDescription>
                  </div>
                  <Badge className={cn('border shrink-0', statusColors[procurement.status])}>
                    <span className="mr-1">{getStatusIcon(procurement.status)}</span>
                    {procurement.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold">{formatCurrency(procurement.budget)}</span>
                    </div>
                    <Progress 
                      value={Math.min((procurement.spent / procurement.budget) * 100, 100)} 
                      className="h-1.5 mt-1.5 bg-muted/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Priority</p>
                      <Badge variant="outline" className={cn('font-medium text-xs mt-0.5', priorityColors[procurement.priority])}>
                        {procurement.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Due Date</p>
                      <p className="text-sm font-medium mt-0.5">
                        {procurement.dueDate ? formatDate(procurement.dueDate) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 flex items-center justify-between border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(/procurement/)}
                      className="text-xs gap-1 hover:gap-2 transition-all"
                    >
                      View Details
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(/procurement/)}>
                          <Eye className="h-3 w-3 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(/procurement//edit)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(procurement.id)}>
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
