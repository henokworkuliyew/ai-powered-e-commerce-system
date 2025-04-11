'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Users,
  Settings,
  Package,
  LayoutDashboard,
  //LogOut,
  ShoppingCart,
  Tag,
  Truck,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/hooks/utils/cn'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import Button from '../ui/Button'

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      title: 'Dashboard',
    },
    {
      href: '/admin/products',
      icon: Package,
      title: 'Products',
    },
    {
      href: '/admin/orders',
      icon: ShoppingCart,
      title: 'Orders',
    },
    {
      href: '/admin/customers',
      icon: Users,
      title: 'Customers',
    },
    {
      href: '/admin/analytics',
      icon: BarChart3,
      title: 'Analytics',
    },
    {
      href: '/admin/inventory',
      icon: Tag,
      title: 'Inventory',
    },
    {
      href: '/admin/shipping',
      icon: Truck,
      title: 'Shipping',
    },
    {
      href: '/admin/payments',
      icon: CreditCard,
      title: 'Payments',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      title: 'Settings',
    },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r ">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center font-bold">
          <Package className="mr-2 h-5 w-5" />
          <span className="text-xl">ShopAdmin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === route.href && 'bg-muted font-medium text-primary'
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin User" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">
              admin@example.com
            </span>
          </div>
        </div>
        <Button label="Log out" size="small" />
        {/* <LogOut className="mr-2 h-4 w-4" />
        </Button> */}
      </div>
    </div>
  )
}
