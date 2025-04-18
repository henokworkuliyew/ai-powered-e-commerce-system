'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button2'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { Order } from './types'
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface OrderDetailsProps {
  order: Order
  onBack: () => void
}

export default function OrderDetails({ order, onBack }: OrderDetailsProps) {
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

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-emerald-600" />
      case 'cancelled':
      case 'returned':
        return <XCircle className="h-6 w-6 text-rose-600" />
      case 'shipped':
      case 'in transit':
        return <Truck className="h-6 w-6 text-sky-600" />
      case 'pending':
      default:
        return <Clock className="h-6 w-6 text-amber-600" />
    }
  }

  return (
    <div className="bg-slate-50 -m-8 p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-slate-500">Order #{order._id.substring(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <CardTitle>Order Summary</CardTitle>
                <div className="flex gap-2">
                  {getStatusBadge(order.status)}
                  {getDeliveryStatusBadge(order.deliveryStatus)}
                </div>
              </div>
              <CardDescription>
                Placed on{' '}
                {format(
                  new Date(order.createDate),
                  "MMMM dd, yyyy 'at' h:mm a"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-slate-600" />
                    <span>
                      Payment ID: {order.paymentIntentId.substring(0, 16)}...
                    </span>
                  </div>
                  <span className="font-medium">
                    Total: {order.amount.toLocaleString()} {order.currency}
                  </span>
                </div>

                <Separator />

                <div className="space-y-0">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-slate-50 transition-colors border-b last:border-0"
                    >
                      <div className="relative h-28 w-28 rounded-md overflow-hidden bg-white border flex-shrink-0 mx-auto sm:mx-0">
                        <Image
                          src={product.selectedImg.image || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-medium text-slate-900">
                          {product.name}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                        <div className="mt-3 inline-flex flex-wrap justify-center sm:justify-start gap-3 text-sm">
                          <div className="px-2 py-1 bg-slate-100 rounded-full">
                            <span className="text-slate-600">Brand: </span>
                            <span className="font-medium">{product.brand}</span>
                          </div>
                          <div className="px-2 py-1 bg-slate-100 rounded-full">
                            <span className="text-slate-600">Category: </span>
                            <span className="font-medium">
                              {product.category}
                            </span>
                          </div>
                          <div className="px-2 py-1 bg-slate-100 rounded-full flex items-center">
                            <span className="text-slate-600 mr-1">Color: </span>
                            <div
                              className="h-3 w-3 rounded-full border"
                              style={{
                                backgroundColor: product.selectedImg.colorCode,
                              }}
                            />
                            <span className="font-medium ml-1">
                              {product.selectedImg.color}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center justify-between sm:items-end sm:justify-center gap-2 sm:min-w-[120px] mt-3 sm:mt-0 bg-slate-50 p-2 rounded-md sm:bg-transparent sm:p-0">
                        <div className="text-sm text-slate-600">
                          {product.quantity} × {product.price.toLocaleString()}{' '}
                          {order.currency}
                        </div>
                        <div className="font-medium text-slate-900">
                          {(product.quantity * product.price).toLocaleString()}{' '}
                          {order.currency}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-slate-600" />
                Delivery Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-md">
                {getDeliveryStatusIcon(order.deliveryStatus)}
                <div>
                  <h4 className="font-medium capitalize text-slate-900">
                    {order.deliveryStatus}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {order.deliveryStatus === 'delivered'
                      ? 'Your order has been delivered successfully.'
                      : order.deliveryStatus === 'shipped'
                      ? 'Your order has been shipped and is on its way.'
                      : order.deliveryStatus === 'in transit'
                      ? 'Your order is in transit to your location.'
                      : order.deliveryStatus === 'returned'
                      ? 'Your order has been returned.'
                      : 'Your order is being processed.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-600" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 bg-slate-50 p-4 rounded-md">
                <p className="font-medium text-slate-900">
                  {order.address.name}
                </p>
                <p className="text-slate-700">{order.address.street}</p>
                <p className="text-slate-700">
                  {order.address.city}, {order.address.zipCode}
                </p>
                <p className="text-slate-700">{order.address.country}</p>
                <Separator className="my-3" />
                <div className="flex items-center gap-3 bg-white p-2 rounded-md">
                  <Phone className="h-4 w-4 text-slate-600" />
                  <span>{order.address.phone}</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-md">
                  <Mail className="h-4 w-4 text-slate-600" />
                  <span>{order.address.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b">
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">
                    {order.amount.toLocaleString()} {order.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-900">Free</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Tax</span>
                  <span className="text-slate-900">Included</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-medium">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">
                    {order.amount.toLocaleString()} {order.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button
              onClick={onBack}
              variant="outline"
              className="w-full hover:bg-slate-100"
            >
              Back to My Orders
            </Button>
            {order.status === 'completed' &&
              order.deliveryStatus === 'delivered' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Buy Again
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
