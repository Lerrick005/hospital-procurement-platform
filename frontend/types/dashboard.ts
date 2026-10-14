export interface KPIMetric {
  id: string
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: string
  description: string
}

export interface Activity {
  id: string
  type: 'procurement' | 'approval' | 'supplier' | 'system'
  title: string
  description: string
  timestamp: string
  user: string
  avatar?: string
}

export interface ApprovalQueue {
  id: string
  title: string
  requester: string
  department: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  priority: Priority
  requestedAt: string
}
