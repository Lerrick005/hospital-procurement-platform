import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const procurementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  department: z.string().min(1, 'Department is required'),
  budget: z.number().positive('Budget must be positive'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ProcurementInput = z.infer<typeof procurementSchema>
