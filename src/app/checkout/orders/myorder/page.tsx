import type { Metadata } from 'next'
import MyOrdersClient from './myOrder'

export const metadata: Metadata = {
  title: 'My Orders | Your Store',
  description: 'View and track your order history',
}

export default async function MyOrdersPage() {
  return (
    <div className="container py-10 p-8">
      <MyOrdersClient />
    </div>
  )
}
