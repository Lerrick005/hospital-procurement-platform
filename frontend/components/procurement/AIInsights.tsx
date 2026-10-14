'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, AlertCircle, Flag, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Insight {
  icon: any
  label: string
  description: string
  color: string
  bg: string
  trend: 'up' | 'down'
}

interface AIInsightsProps {
  insights: Insight[]
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {insights.map((insight, index) => {
        const Icon = insight.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4 }}
          >
            <Card className="group bg-gradient-to-br from-background to-muted/10 border-border/50 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-healthcare-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-4 relative">
                <div className="flex items-center gap-4">
                  <div className={cn('rounded-xl p-3', insight.bg)}>
                    <Icon className={cn('h-5 w-5', insight.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{insight.label}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {insight.trend === 'up' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
