
import AdminNav from "@/components/admin/AdminNav"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'AI-powered e-commerce admin page',
  keywords: ['e-commerce', 'AI', 'shopping', 'online store'],
 
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <AdminNav/>
      <div>
        {children}
      </div>
    </div>
  )
}
