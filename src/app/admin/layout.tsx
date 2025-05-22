import type React from 'react'
// import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/action/CurrentUser'
import AdminSidebar from '@/components/admin/adminSideBar'
import { Toaster } from '@/components/ui/toaster'
// import { AdminSidebar } from '@/components/admin/adminSideBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    
  }

  return (
    <div className="flex min-h-screen">
      <Toaster />
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 ">{children}</main>
    </div>
  )
}
