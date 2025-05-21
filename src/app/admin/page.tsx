import type { Metadata } from 'next'

import { ManagersTable } from '@/components/admin/managers-table'
import AddManagerForm from '@/components/admin/add-manager-form'

export const metadata: Metadata = {
  title: 'Admin | Managers',
  description: 'Manage store managers',
}

export default async function ManagersPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Managers</h1>
        <p className="text-muted-foreground">
          Add and manage store managers for your e-commerce platform.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Manager</h2>
          <AddManagerForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Managers</h2>
          <ManagersTable />
        </div>
      </div>
    </div>
  )
}
