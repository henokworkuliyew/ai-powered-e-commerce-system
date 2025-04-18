'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button2'
import OrderDetails from './orderDetail'
import type { Order } from './types'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
  AlertCircle,
} from 'lucide-react'
import OrderCard from './orderedCard'
import LoadingSkeleton from './loading'

export default function MyOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/payment/payment-intent')
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()

        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          console.error('Invalid orders data format:', data)
          setOrders([])
          setError('Received invalid data format from server')
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setOrders([]) // Ensure orders is always an array
        setError('Failed to load your orders. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-rose-600" />
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-amber-600" />
    }
  }

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />
      case 'shipped':
      case 'in transit':
        return <TruckIcon className="h-5 w-5 text-sky-600" />
      case 'returned':
        return <XCircle className="h-5 w-5 text-rose-600" />
      case 'pending':
      default:
        return <Package className="h-5 w-5 text-amber-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-800 border-emerald-200"
          >
            Completed
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge
            variant="outline"
            className="bg-rose-100 text-rose-800 border-rose-200"
          >
            Cancelled
          </Badge>
        )
      case 'pending':
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            Pending
          </Badge>
        )
    }
  }

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 text-emerald-800 border-emerald-200"
          >
            Delivered
          </Badge>
        )
      case 'shipped':
        return (
          <Badge
            variant="outline"
            className="bg-sky-100 text-sky-800 border-sky-200"
          >
            Shipped
          </Badge>
        )
      case 'in transit':
        return (
          <Badge
            variant="outline"
            className="bg-violet-100 text-violet-800 border-violet-200"
          >
            In Transit
          </Badge>
        )
      case 'returned':
        return (
          <Badge
            variant="outline"
            className="bg-rose-100 text-rose-800 border-rose-200"
          >
            Returned
          </Badge>
        )
      case 'pending':
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            Pending
          </Badge>
        )
    }
  }

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders
    return orders.filter((order) => order.status === status)
  }

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    )
  }

  return (
    <div className="bg-slate-50 -m-8 p-8 min-h-screen">
      <div className="flex flex-col gap-2 mb-8 bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-600">View and track your order history</p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center p-10">
            <div className="text-center bg-slate-50 p-8 rounded-lg w-full max-w-md">
              <AlertCircle className="mx-auto h-14 w-14 text-rose-600 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                Failed to load orders
              </h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-900 px-8 py-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center p-10">
            <div className="text-center bg-slate-50 p-8 rounded-lg w-full max-w-md">
              <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                No orders found
              </h3>
              <p className="text-slate-600 mb-6">
                You have not placed any orders yet.
              </p>
              <Button
                onClick={() => router.push('/')}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-2"
              >
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Tabs defaultValue="all">
            <div className="overflow-x-auto pb-2">
              <TabsList className="mb-6 inline-flex w-auto border-b border-slate-200 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 text-slate-600 hover:text-slate-900"
                >
                  All Orders
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 text-slate-600 hover:text-slate-900"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 text-slate-600 hover:text-slate-900"
                >
                  Completed
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 text-slate-600 hover:text-slate-900"
                >
                  Cancelled
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4 mt-2">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  getStatusIcon={getStatusIcon}
                  getDeliveryStatusIcon={getDeliveryStatusIcon}
                  getStatusBadge={getStatusBadge}
                  getDeliveryStatusBadge={getDeliveryStatusBadge}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-2">
              {filterOrdersByStatus('pending').map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  getStatusIcon={getStatusIcon}
                  getDeliveryStatusIcon={getDeliveryStatusIcon}
                  getStatusBadge={getStatusBadge}
                  getDeliveryStatusBadge={getDeliveryStatusBadge}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-2">
              {filterOrdersByStatus('completed').map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  getStatusIcon={getStatusIcon}
                  getDeliveryStatusIcon={getDeliveryStatusIcon}
                  getStatusBadge={getStatusBadge}
                  getDeliveryStatusBadge={getDeliveryStatusBadge}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4 mt-2">
              {filterOrdersByStatus('cancelled').map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  getStatusIcon={getStatusIcon}
                  getDeliveryStatusIcon={getDeliveryStatusIcon}
                  getStatusBadge={getStatusBadge}
                  getDeliveryStatusBadge={getDeliveryStatusBadge}
                  onViewDetails={() => setSelectedOrder(order)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
