'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  FileText, 
  Package, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  Sun,
  Moon,
  Building2,
  User,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Procurement', icon: ShoppingBag, href: '/procurement' },
  { label: 'Suppliers', icon: Users, href: '/suppliers' },
  { label: 'RFQs', icon: FileText, href: '/rfq' },
  { label: 'Purchase Orders', icon: Package, href: '/purchase-orders' },
  { label: 'Inventory', icon: Package, href: '/inventory' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <motion.aside
      className={cn(
        'relative flex h-screen flex-col bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hospital Logo */}
      <div className="flex h-16 items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-healthcare-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-semibold text-lg"
            >
              MediProcure
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.label}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-soft' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground"
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-4">
        <div className="flex flex-col gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn('w-full justify-start gap-3', collapsed && 'justify-center')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {!collapsed && <span>Theme</span>}
          </Button>

          {/* User Profile */}
          <div className={cn(
            'flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors duration-200',
            collapsed && 'justify-center'
          )}>
            <div className="h-8 w-8 rounded-full bg-healthcare-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-healthcare-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground truncate">Procurement Director</p>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn('w-full justify-center', !collapsed && 'justify-end')}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}

