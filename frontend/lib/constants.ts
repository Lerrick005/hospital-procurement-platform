export const APP_NAME = 'Hospital Procurement Platform'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROCUREMENT: '/procurement',
  SUPPLIERS: '/suppliers',
  RFQ: '/rfq',
  PURCHASE_ORDERS: '/purchase-orders',
  INVENTORY: '/inventory',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const

export const API_ENDPOINTS = {
  AUTH: '/auth',
  PROCUREMENT: '/procurement',
  SUPPLIERS: '/suppliers',
  RFQ: '/rfq',
  PO: '/purchase-orders',
  INVENTORY: '/inventory',
  ANALYTICS: '/analytics',
  NOTIFICATIONS: '/notifications',
  DASHBOARD: '/dashboard',
} as const
