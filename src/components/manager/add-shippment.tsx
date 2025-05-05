'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button2'
import { useToast } from '@/components/ui/use-toast'
import {
  Loader2,
  Truck,
  Package,
  ShoppingBag,
  CheckCircle2,
  Bell,
  MapPin,
  Clock,
} from 'lucide-react'
import type { IOrder } from '@/server/models/Order'
import type { IAddress } from '@/server/models/Address'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type { Carrier } from '@/type/Carrier'
import type { Shipment } from '@/type/Shipment'
import { cn } from '@/lib/utils'

interface AddShipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShipmentAdded: () => void
}

export default function AddShipmentDialog({
  open,
  onOpenChange,
  onShipmentAdded,
}: AddShipmentDialogProps) {
  const { toast } = useToast()
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [isSearchingOrder, setIsSearchingOrder] = useState(false)
  const [orderResults, setOrderResults] = useState<IOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([])
  const [isLoadingRecentOrders, setIsLoadingRecentOrders] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrierId, setCarrierId] = useState('')
  const [status, setStatus] = useState<Shipment['status']>('processing')
  const [dateShipped, setDateShipped] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<{
    name: string
    email: string
    address: {
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }>({
    name: '',
    email: '',
    address: {
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  })
  const [autoAssignCarrier, setAutoAssignCarrier] = useState(true)
  const [autoUpdateStatus, setAutoUpdateStatus] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('')
  const [localCarriers, setLocalCarriers] = useState<Carrier[]>([])

  const fetchCarriers = async () => {
    setIsLoadingCarriers(true)
    setError(null)

    try {
      const response = await fetch('/api/carrier')

      if (!response.ok) {
        throw new Error('Failed to fetch carriers')
      }

      const data = await response.json()
      console.log('Fetched carriers:', data.carriers)

      setCarriers(data.carriers)
      // Filter carriers for local delivery or use all carriers if none are specifically marked for local delivery
      setLocalCarriers(data.carriers.filter((c: Carrier) => c.isActive) || [])
    } catch (error: unknown) {
      console.error('Error fetching carriers:', error)
      setError('Failed to load carriers. Using default carriers instead.')
    } finally {
      setIsLoadingCarriers(false)
    }
  }

  const fetchRecentOrders = async () => {
    setIsLoadingRecentOrders(true)
    setError(null)

    try {
      const response = await fetch(
        '/api/orders?limit=5&sort=createdAt:desc&status=pending'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch recent orders')
      }

      const data = await response.json()
      setRecentOrders(data.orders || [])

      // Count new unshipped orders
      const unshippedOrders = data.orders.filter(
        (order: IOrder) =>
          order.orderStatus === 'pending' || order.orderStatus === 'delivered'
      )
      setNewOrdersCount(unshippedOrders.length)
    } catch (error) {
      console.error('Error fetching recent orders:', error)
      setError('Failed to load recent orders.')
      setRecentOrders([])
    } finally {
      setIsLoadingRecentOrders(false)
    }
  }

  const searchOrders = async () => {
    if (!orderSearchTerm.trim()) return

    setIsSearchingOrder(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/orders?search=${encodeURIComponent(orderSearchTerm)}`
      )

      if (!response.ok) {
        throw new Error('Failed to search orders')
      }

      const data = await response.json()
      setOrderResults(data.orders || [])

      if (data.orders.length === 0) {
        toast({
          title: 'No orders found',
          description: 'No orders match your search criteria.',
        })
      }
    } catch (error) {
      console.error('Error searching orders:', error)
      setError('Failed to search orders.')
      setOrderResults([])
    } finally {
      setIsSearchingOrder(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchCarriers()
      fetchRecentOrders()
    }
  }, [open])

 
  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const orderData1 = await response.json()
      const orderData = orderData1.order
     
      let addressData: Partial<IAddress> | null = null

      if (orderData.shippingAddressId) {
        
        if (
          typeof orderData.shippingAddressId === 'object' &&
          orderData.shippingAddressId.addressLine1
        ) {
          
          addressData = orderData.shippingAddressId as Partial<IAddress>
        } else {
          
       
          try {
            const addressResponse = await fetch(
              `/api/addresses/${orderData.shippingAddressId}`
            )
            if (addressResponse.ok) {
              const addressResult = await addressResponse.json()
              addressData = addressResult.address
              console.log('Fetched address data:', addressData)
            }
          } catch (error) {
            console.error('Error fetching address:', error)
          }
        }
      }

      // If we still don't have address data, try to get it from the order itself
      if (!addressData && orderData.shippingAddress) {
        addressData = orderData.shippingAddress
      }

      // Set shipping address with fallbacks for missing data
      setShippingAddress({
        name:
          addressData?.fullName ||
          orderData.userId?.name ||
          orderData.customerName ,
        email:
          addressData?.email ||
          orderData.userId?.email ||
          orderData.customerEmail ||
          '',
        address: {
          addressLine1:
            addressData?.addressLine1 ||
            orderData.shippingAddress?.addressLine1 ||
            '',
          addressLine2:
            addressData?.addressLine2 ||
            orderData.shippingAddress?.addressLine2,
          city: addressData?.city || orderData.shippingAddress?.city || '',
          state: addressData?.state || orderData.shippingAddress?.state || '',
          postalCode:
            addressData?.postalCode ||
            orderData.shippingAddress?.postalCode ||
            '',
          country:
            addressData?.country || orderData.shippingAddress?.country || '',
        },
      })

      return orderData
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to fetch order details.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const selectOrder = async (order: IOrder) => {
    setSelectedOrder(order)

    await fetchOrderDetails(order._id?.toString() || '')

    generateTrackingNumber()

    if (autoAssignCarrier) {
      // Only try to assign carrier if we have carriers loaded
      if (carriers.length || localCarriers.length) {
        assignBestLocalCarrier()
      } else {
       
        const checkCarriersInterval = setInterval(() => {
          if (carriers.length || localCarriers.length) {
            assignBestLocalCarrier()
            clearInterval(checkCarriersInterval)
          }
        }, 500)
        // Clear interval after 5 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkCarriersInterval), 5000)
      }
    }

    if (autoUpdateStatus) {
      const today = new Date().toISOString().split('T')[0]
      setDateShipped(today)
      setStatus('processing')

      // Set estimated delivery time for local delivery (usually same day or next day)
      calculateEstimatedDeliveryTime()
    }
  }

  const generateTrackingNumber = () => {
    const prefix = 'LC' // Local Carrier prefix
    const randomPart = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, '0')
    const timestamp = Date.now().toString().slice(-4)
    setTrackingNumber(`${prefix}${randomPart}${timestamp}`)
  }

  // Calculate estimated delivery time based on current time
  const calculateEstimatedDeliveryTime = () => {
    const now = new Date()
    const hour = now.getHours()

    // If it's before 2 PM, delivery today; otherwise, tomorrow
    if (hour < 14) {
      setEstimatedDeliveryTime('Today, by 6 PM')
    } else {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' }
      const dayName = tomorrow.toLocaleDateString('en-US', options)
      setEstimatedDeliveryTime(`${dayName}, by 12 PM`)
    }
  }

  const assignBestLocalCarrier = () => {
    // Use localCarriers if available, otherwise fall back to all carriers
    const availableCarriers = localCarriers.length ? localCarriers : carriers

    if (!availableCarriers.length) return

    // For local delivery, we can assign based on simple criteria like availability or zone
    // Here we're just picking the first available carrier
    const bestCarrier = availableCarriers[0]
    if (bestCarrier) {
      setCarrierId(bestCarrier._id)
      console.log('Assigned carrier:', bestCarrier.name, bestCarrier._id)
    }
  }

  const resetForm = () => {
    setOrderSearchTerm('')
    setOrderResults([])
    setSelectedOrder(null)
    setTrackingNumber('')
    setCarrierId('')
    setStatus('processing')
    setDateShipped('')
    setNotes('')
    setShippingAddress({
      name: '',
      email: '',
      address: {
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    })
    setIsComplete(false)
    setIsProcessing(false)
    setError(null)
    setEstimatedDeliveryTime('')
  }

  const handleSubmit = async () => {
    if (!selectedOrder || !trackingNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description:
          'Please select an order and ensure tracking number is generated.',
      })
      return
    }

    setIsProcessing(true)
    setError(null)

    console.log('Submitting with carrier ID:', carrierId)
    console.log('Available carriers:', carriers)
    console.log('Available local carriers:', localCarriers)
    console.log('Shipping address:', shippingAddress)

    // If no carrier is selected but we have carriers available, try to assign one
    if (!carrierId && (carriers.length || localCarriers.length)) {
      assignBestLocalCarrier()
    }

    // If we still don't have a carrier ID, create an error
    if (!carrierId && carriers.length > 0) {
      setError('Failed to assign a carrier. Please try again.')
      setIsProcessing(false)
      return
    }

    // Final fallback - if no carriers are available at all, create a virtual carrier ID
    const finalCarrierId = carrierId || 'local_default_carrier'

    try {
      const shipmentData = {
        orderId: selectedOrder._id,
        trackingNumber,
        carrierId: finalCarrierId,
        status: 'processing',
        dateShipped: dateShipped || new Date().toISOString(),
        customer: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          address: {
            addressLine1: shippingAddress.address.addressLine1 || '',
            addressLine2: shippingAddress.address.addressLine2,
            city: shippingAddress.address.city || '',
            state: shippingAddress.address.state || '',
            postalCode: shippingAddress.address.postalCode || '',
            country: shippingAddress.address.country || '',
          },
        },
        notes,
        items: selectedOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
        })),
        estimatedDelivery: estimatedDeliveryTime,
        isLocalDelivery: true,
      }

      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create shipment')
      }

      if (autoUpdateStatus) {
        await fetch(`/api/orders/${selectedOrder._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderStatus: 'processing',
          }),
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus('processing')

      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus('in_transit')

      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: 'Local Shipment Created',
        description: `The shipment has been successfully created and will be delivered ${estimatedDeliveryTime.toLowerCase()}.`,
      })

      setIsComplete(true)
      setIsProcessing(false)

      // Update the count of new orders
      setNewOrdersCount((prev) => Math.max(0, prev - 1))

      setTimeout(() => {
        resetForm()
        onShipmentAdded()
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error('Error creating shipment:', error)
      setError(
        error instanceof Error ? error.message : 'Failed to create shipment.'
      )
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-w-md bg-[#f8f9fa] border-[#e0e4e8] p-0 overflow-hidden rounded-xl">
        <DialogHeader className="bg-[#4a6bff] text-white p-4">
          <DialogTitle className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Local Express Shipment
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!selectedOrder && !isComplete && (
            <div className="text-sm text-[#5a6474] mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-[#4a6bff]" />
              Select an order to create a local city delivery.
            </div>
          )}

          {!isComplete && !error ? (
            <>
              {!selectedOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search by order number"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="flex-1 border-[#e0e4e8] focus-visible:ring-[#4a6bff]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          searchOrders()
                        }
                      }}
                    />
                    <Button
                      onClick={searchOrders}
                      disabled={isSearchingOrder}
                      className="bg-[#4a6bff] hover:bg-[#3a5bef] text-white"
                    >
                      {isSearchingOrder ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>

                  {isLoadingRecentOrders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
                    </div>
                  ) : (
                    <>
                      {recentOrders.length > 0 && !orderResults.length && (
                        <Card className="border-[#e0e4e8] shadow-sm">
                          <CardContent className="p-0">
                            <div className="bg-[#f0f2f5] px-4 py-2 font-medium text-sm border-b border-[#e0e4e8] flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-[#4a6bff]" />
                                Recent Orders
                              </div>
                              {newOrdersCount > 0 && (
                                <Badge className="bg-[#ff4d4f] text-white">
                                  {newOrdersCount} new
                                </Badge>
                              )}
                            </div>
                            <div className="divide-y divide-[#e0e4e8]">
                              {recentOrders.map((order) => (
                                <div
                                  key={order._id?.toString()}
                                  className={cn(
                                    'p-4 flex justify-between items-center cursor-pointer hover:bg-[#f0f2f5] transition-colors',
                                    (order.orderStatus === 'pending' ||
                                      order.orderStatus === 'delivered') &&
                                      'border-l-4 border-[#ff4d4f]'
                                  )}
                                  onClick={() => selectOrder(order)}
                                >
                                  <div>
                                    <div className="font-medium text-[#2d3748] flex items-center">
                                      Order #{order.orderNumber}
                                      {(order.orderStatus === 'pending' ||
                                        order.orderStatus === 'delivered') && (
                                        <Badge className="ml-2 bg-[#ff4d4f] text-white text-xs">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-[#5a6474]">
                                      {shippingAddress.name || 'Unknown'} -{' '}
                                      {order.items.length} items
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#4a6bff] text-[#4a6bff] hover:bg-[#eef1ff] hover:text-[#3a5bef]"
                                  >
                                    Select
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {orderResults.length > 0 && (
                        <Card className="border-[#e0e4e8] shadow-sm">
                          <CardContent className="p-0">
                            <div className="bg-[#f0f2f5] px-4 py-2 font-medium text-sm border-b border-[#e0e4e8]">
                              Search Results
                            </div>
                            <div className="divide-y divide-[#e0e4e8]">
                              {orderResults.map((order) => (
                                <div
                                  key={order._id?.toString()}
                                  className={cn(
                                    'p-4 flex justify-between items-center cursor-pointer hover:bg-[#f0f2f5] transition-colors',
                                    (order.orderStatus === 'pending' ||
                                      order.orderStatus === 'delivered') &&
                                      'border-l-4 border-[#ff4d4f]'
                                  )}
                                  onClick={() => selectOrder(order)}
                                >
                                  <div>
                                    <div className="font-medium text-[#2d3748] flex items-center">
                                      Order #{order.orderNumber}
                                      {(order.orderStatus === 'pending' ||
                                        order.orderStatus === 'delivered') && (
                                        <Badge className="ml-2 bg-[#ff4d4f] text-white text-xs">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-[#5a6474]">
                                      {shippingAddress.name || 'Unknown'} -{' '}
                                      {order.items.length} items
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#4a6bff] text-[#4a6bff] hover:bg-[#eef1ff] hover:text-[#3a5bef]"
                                  >
                                    Select
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
                    </div>
                  ) : (
                    <>
                      <Card className="border-[#e0e4e8] shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Package className="h-5 w-5 text-[#4a6bff] mr-2" />
                              <h3 className="font-medium text-[#2d3748]">
                                Order Details
                              </h3>
                            </div>
                            <Badge className="bg-[#4a6bff]">
                              #{selectedOrder.orderNumber}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-[#5a6474]">Customer:</span>
                              <span className="font-medium text-[#2d3748]">
                                {shippingAddress.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5a6474]">Items:</span>
                              <span className="font-medium text-[#2d3748]">
                                {selectedOrder.items.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#5a6474]">Total:</span>
                              <span className="font-medium text-[#2d3748]">
                                $
                                {(
                                  selectedOrder.subtotal +
                                  selectedOrder.tax +
                                  selectedOrder.shipping
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#e0e4e8]">
                            <div className="text-xs text-[#5a6474] mb-1 flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-[#4a6bff]" />
                              Delivery address:
                            </div>
                            <div className="text-sm text-[#2d3748]">
                              {shippingAddress.address.addressLine1 ||
                                'No address available'}{' '}
                              {shippingAddress.address.addressLine1 &&
                                shippingAddress.address.city && (
                                  <>
                                    , {shippingAddress.address.city},{' '}
                                    {shippingAddress.address.postalCode}
                                  </>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#e0e4e8] shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Truck className="h-5 w-5 text-[#4a6bff] mr-2" />
                            <h3 className="font-medium text-[#2d3748]">
                              Local Delivery Settings
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-[#2d3748]">
                                  Auto-assign local carrier
                                </Label>
                                <p className="text-xs text-[#5a6474]">
                                  Best local carrier will be selected for city
                                  delivery
                                </p>
                              </div>
                              <Switch
                                checked={autoAssignCarrier}
                                onCheckedChange={(checked) => {
                                  setAutoAssignCarrier(checked)
                                  if (checked) {
                                    assignBestLocalCarrier()
                                  }
                                }}
                                className="data-[state=checked]:bg-[#4a6bff]"
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <Label className="text-[#2d3748]">
                                  Auto-update status
                                </Label>
                                <p className="text-xs text-[#5a6474]">
                                  Status will update automatically based on time
                                </p>
                              </div>
                              <Switch
                                checked={autoUpdateStatus}
                                onCheckedChange={setAutoUpdateStatus}
                                className="data-[state=checked]:bg-[#4a6bff]"
                              />
                            </div>

                            <div className="pt-2 border-t border-[#e0e4e8]">
                              <div className="flex justify-between items-center mb-1">
                                <Label className="text-[#5a6474]">
                                  Tracking Number:
                                </Label>
                                <span className="text-sm font-mono text-[#2d3748]">
                                  {trackingNumber}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mb-1">
                                <Label className="text-[#5a6474]">
                                  Carrier:
                                </Label>
                                <span className="text-sm text-[#2d3748]">
                                  {isLoadingCarriers ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : carrierId ? (
                                    carriers.find((c) => c._id === carrierId)
                                      ?.name || 'Local Carrier'
                                  ) : (
                                    'Auto-assigned Local Carrier'
                                  )}
                                </span>
                              </div>

                              <div className="flex justify-between items-center mb-1">
                                <Label className="text-[#5a6474]">
                                  Status:
                                </Label>
                                <Badge className="bg-orange-500">
                                  {status.replace('_', ' ')}
                                </Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <Label className="text-[#5a6474]">
                                  Estimated Delivery:
                                </Label>
                                <Badge className="bg-green-500">
                                  {estimatedDeliveryTime}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="pt-2">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add delivery instructions or notes..."
                          rows={2}
                          className="border-[#e0e4e8] focus-visible:ring-[#4a6bff] text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-50 rounded-full p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                Local Shipment Created!
              </h3>
              <p className="text-center text-[#5a6474] mb-4">
                Your local shipment has been successfully created and will be
                delivered {estimatedDeliveryTime.toLowerCase()}.
              </p>
              <div className="bg-[#f0f2f5] rounded-md p-3 w-full text-center">
                <p className="text-sm font-medium text-[#2d3748]">
                  Tracking Number
                </p>
                <p className="text-lg font-mono text-[#2d3748]">
                  {trackingNumber}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-[#f0f2f5] border-t border-[#e0e4e8] p-4">
          <div className="w-full flex justify-between">
            {!isComplete && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedOrder) {
                      setSelectedOrder(null)
                    } else {
                      onOpenChange(false)
                    }
                  }}
                  className="border-[#e0e4e8] text-[#5a6474] hover:bg-[#f0f2f5]"
                >
                  {selectedOrder ? 'Back' : 'Cancel'}
                </Button>

                {selectedOrder && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || isLoading || isLoadingCarriers}
                    className="bg-[#4a6bff] hover:bg-[#3a5bef] text-white flex items-center"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        {newOrdersCount > 0 && (
                          <Bell className="h-4 w-4 mr-1 animate-pulse" />
                        )}
                        Create Local Shipment
                      </>
                    )}
                  </Button>
                )}
              </>
            )}

            {isComplete && (
              <Button
                onClick={() => {
                  resetForm()
                  onShipmentAdded()
                  onOpenChange(false)
                }}
                className="w-full bg-[#4a6bff] hover:bg-[#3a5bef] text-white"
              >
                Close
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
