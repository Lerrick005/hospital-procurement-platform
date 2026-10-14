'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, 
  RefreshCw, 
  Filter, 
  Sparkles,
  ChevronDown,
  List,
  LayoutGrid
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FiltersProps {
  search: string
  setSearch: (value: string) => void
  viewMode: 'table' | 'grid'
  setViewMode: (value: 'table' | 'grid') => void
  selectedStatus: string | null
  setSelectedStatus: (value: string | null) => void
  activeTab: string
  setActiveTab: (value: string) => void
  procurements: any[]
  onRefresh: () => void
}

export function Filters({
  search,
  setSearch,
  viewMode,
  setViewMode,
  selectedStatus,
  setSelectedStatus,
  activeTab,
  setActiveTab,
  procurements,
  onRefresh
}: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const statuses = ['draft', 'pending', 'approved', 'rejected', 'completed']

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <Button
            variant={!selectedStatus ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus(null)}
            className="rounded-full px-4 whitespace-nowrap"
          >
            All
            <span className="ml-1.5 text-xs opacity-60">({procurements?.length || 0})</span>
          </Button>
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="rounded-full px-4 capitalize whitespace-nowrap"
            >
              {status}
              <span className="ml-1.5 text-xs opacity-60">
                ({procurements?.filter(p => p.status === status).length || 0})
              </span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={cn('h-3 w-3 transition-transform', showFilters && 'rotate-180')} />
          </Button>
          <div className="flex items-center rounded-lg border border-border p-1 bg-muted/10">
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
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>All Statuses</option>
                      <option>Draft</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>All Priorities</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                      <option>All Departments</option>
                      <option>Radiology</option>
                      <option>Surgery</option>
                      <option>Pharmacy</option>
                      <option>Laboratory</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Budget Range</label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Min" className="flex-1" />
                      <Input type="number" placeholder="Max" className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" size="sm">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="AI-powered search: Try 'MRI machine under 300k' or 'pending approvals for radiology'..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/20 border-border/50 focus-visible:bg-background transition-all h-11 rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <Badge variant="outline" className="text-xs bg-healthcare-primary/10 text-healthcare-primary border-healthcare-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Search
            </Badge>
            <kbd className="hidden sm:inline-flex px-2 py-0.5 bg-muted border border-border rounded-md text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
