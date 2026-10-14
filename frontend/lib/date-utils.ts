export const getDateRange = (days: number): { start: Date; end: Date } => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  return { start, end }
}

export const getFinancialYear = (): { start: Date; end: Date } => {
  const now = new Date()
  const year = now.getFullYear()
  const start = new Date(year, 6, 1) // July 1
  const end = new Date(year + 1, 5, 30) // June 30
  return { start, end }
}

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end
}
