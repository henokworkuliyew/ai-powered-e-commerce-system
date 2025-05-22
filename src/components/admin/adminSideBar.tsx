'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  Settings,
  LogOut,
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Managers', href: '/admin/managers', icon: Users },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
    { name: 'Shipments', href: '/admin/shipments', icon: Truck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex flex-col w-64 bg-white  border-r dark:border-gray-700">
      <div className="flex items-center h-16 px-6 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-4 py-3 text-sm rounded-md',
              pathname === item.href
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            )}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t dark:border-gray-700">
        <button className="flex items-center w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
          <LogOut className="w-5 h-5 mr-3" />
          Sign out
        </button>
      </div>
    </div>
  )
}
