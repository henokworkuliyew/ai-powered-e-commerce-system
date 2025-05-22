import type { Metadata } from 'next'
// import { redirect } from 'next/navigation'
// import { getCurrentUser } from '@/action/CurrentUser'
import AdminDashboard from '@/components/admin/admin-dashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing shipping operations',
}

export default async function AdminPage() {
  // const currentUser = await getCurrentUser()

  // if (!currentUser || currentUser.role !== 'ADMIN') {
  //   redirect('/')
  // }

  return <AdminDashboard />
}
