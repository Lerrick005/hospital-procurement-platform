import { Status, Priority } from './index'

export interface Procurement {
  id: string
  title: string
  description: string
  department: string
  budget: number
  spent: number
  status: Status
  priority: Priority
  createdAt: string
  updatedAt: string
  dueDate: string
  assignedTo: string
  supplier?: string
  items: ProcurementItem[]
}

export interface ProcurementItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  category: string
}

export interface BudgetUtilization {
  department: string
  allocated: number
  spent: number
  remaining: number
  percentage: number
}

export interface ProcurementFilters {
  status?: Status
  priority?: Priority
  department?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface ProcurementStats {
  total: number
  pending: number
  approved: number
  rejected: number
  totalBudget: number
  totalSpent: number
}
