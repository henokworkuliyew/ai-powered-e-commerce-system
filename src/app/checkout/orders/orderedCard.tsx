import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { Order } from './types'
import { ChevronRight } from 'lucide-react'
import type { JSX } from 'react'

interface OrderCardProps {
  order: Order
  getStatusIcon: (status: string) => JSX.Element
  getDeliveryStatusIcon: (status: string) => JSX.Element
  getStatusBadge: (status: string) => JSX.Element
  getDeliveryStatusBadge: (status: string) => JSX.Element
  onViewDetails: () => void
}

export default function OrderCard({
  order,
  getStatusIcon,
  getDeliveryStatusIcon,
  getStatusBadge,
  getDeliveryStatusBadge,
  onViewDetails,
}: OrderCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 bg-slate-50">
      <CardHeader className="pb-3 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Order #{order._id.substring(0, 8)}
            </CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(order.createDate), 'MMMM dd, yyyy')}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {getStatusBadge(order.status)}
            {getDeliveryStatusBadge(order.deliveryStatus)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white p-3 rounded-md">
              <span className="text-slate-500 w-[110px]">Payment Status:</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white p-3 rounded-md">
              <span className="text-slate-500 w-[110px]">Delivery Status:</span>
              <div className="flex items-center gap-1">
                {getDeliveryStatusIcon(order.deliveryStatus)}
                <span className="capitalize">{order.deliveryStatus}</span>
              </div>
            </div>
          </div>

          <Separator className="my-1" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-3 text-slate-800">Order Summary</h4>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items:</span>
                  <span>{order.products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Amount:</span>
                  <span className="font-medium">
                    {order.amount.toLocaleString()} {order.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md">
              <h4 className="font-medium mb-3 text-slate-800">
                Shipping Address
              </h4>
              <div className="text-sm space-y-2">
                <p>{order.address.name}</p>
                <p className="text-slate-500">{order.address.street}</p>
                <p className="text-slate-500">
                  {order.address.city}, {order.address.country}{' '}
                  {order.address.zipCode}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              className="hover:bg-slate-100"
              onClick={onViewDetails}
            >
              View Order Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
