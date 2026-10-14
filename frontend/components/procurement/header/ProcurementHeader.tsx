'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Sparkles, 
  Bell, 
  MessageSquare, 
  Download, 
  Share2, 
  Maximize2, 
  Minimize2 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProcurementHeaderProps {
  isFullscreen: boolean
  toggleFullscreen: () => void
  totalCount: number
}

export function ProcurementHeader({ isFullscreen, toggleFullscreen, totalCount }: ProcurementHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-healthcare-primary via-healthcare-primary/80 to-healthcare-accent bg-clip-text text-transparent">
            Procurement Intelligence
          </h1>
          <Badge variant="outline" className="bg-healthcare-primary/10 text-healthcare-primary border-healthcare-primary/20 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2 flex items-center gap-4"
        >
          <span>Enterprise procurement management with real-time insights</span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium">Live</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {totalCount} active procurements
          </span>
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Bell className="h-4 w-4" />
          <span className="relative">
            Alerts
            <span className="absolute -top-1 -right-3 h-4 w-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">3</span>
          </span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-healthcare-primary to-healthcare-accent text-white hover:opacity-90 border-0 shadow-soft hover:shadow-soft-lg transition-all"
        >
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </Button>
        <Button 
          onClick={() => router.push('/procurement/new')} 
          className="gap-2 shadow-soft hover:shadow-soft-lg transition-all bg-gradient-to-r from-healthcare-primary to-healthcare-accent"
        >
          <Plus className="h-4 w-4" />
          New Procurement
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-9 w-9">
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </motion.div>
    </div>
  )
}
