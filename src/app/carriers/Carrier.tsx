'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button2'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import {
  Loader2,
  Truck,
  Package,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit,
  RefreshCw,
  ChevronRight,
  BarChart3,
} from 'lucide-react'
import type { Carrier } from '@/type/Carrier'
import type { Shipment } from '@/type/Shipment'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CarrierDashboardPage() {
  const [carrier, setCarrier] = useState<Carrier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false)
  const [showDeliveredDialog, setShowDeliveredDialog] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [shipmentStatus, setShipmentStatus] =
    useState<Shipment['status']>('in_transit')
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([])
  const [isLoadingShipments, setIsLoadingShipments] = useState(false)
  const { toast } = useToast()

  // Mock function to get the current carrier ID (in a real app, this would come from auth)
  const getCurrentCarrierId = () => {
    // This would normally come from authentication
    return localStorage.getItem('carrierId') || '6817db7c8693a6b377e43817'
  }

  const fetchCarrierProfile = async () => {
    setIsLoading(true)
    try {
      const carrierId = getCurrentCarrierId()
      const response = await fetch(`/api/carrier/${carrierId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch carrier profile')
      }

      const data = await response.json()
      setCarrier(data.carrier)
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load your profile',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRecentShipments = async () => {
    setIsLoadingShipments(true)
    try {
      const carrierId = getCurrentCarrierId()
      const response = await fetch(
        `/api/shipments?carrierId=${carrierId}&limit=5`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch recent shipments')
      }

      const data = await response.json()
      setRecentShipments(data.shipments || [])
    } catch (error) {
      console.error('Error fetching recent shipments:', error)
    } finally {
      setIsLoadingShipments(false)
    }
  }

  useEffect(() => {
    fetchCarrierProfile()
    fetchRecentShipments()
  }, [])

  const handleStatusToggle = async () => {
    if (!carrier) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/carrier/${carrier._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !carrier.isActive,
          
          ...(carrier.isActive === false
            ? { activatedAt: new Date().toISOString() }
            : {}),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const data = await response.json()
      setCarrier(data.carrier)

      toast({
        title: 'Status Updated',
        description: `You are now ${
          !carrier.isActive ? 'available' : 'unavailable'
        } for deliveries`,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating status:', error)
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your status',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateShipmentStatus = async () => {
    if (!carrier || !carrier.currentShipment) return

    setIsUpdating(true)
    try {
      const response = await fetch(
        `/api/shipments/${carrier.currentShipment.shipmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: shipmentStatus,
            notes: deliveryNotes,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update shipment status')
      }

      toast({
        title: 'Status Updated',
        description: `Shipment status has been updated to ${shipmentStatus.replace(
          '_',
          ' '
        )}`,
      })

      // If the status is "delivered", also mark the delivery as complete
      if (shipmentStatus === 'delivered') {
        await handleMarkDelivered()
      } else {
        fetchCarrierProfile()
        setShowDeliveredDialog(false)
        setDeliveryNotes('')
      }
    } catch (error) {
      if(error instanceof Error) {  
        console.error('Error updating shipment status:', error)
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update shipment status',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkDelivered = async () => {
    if (!carrier || !carrier.currentShipment) return

    setIsMarkingDelivered(true)
    try {
      // 1. Update the shipment status to delivered
      const shipmentResponse = await fetch(
        `/api/shipments/${carrier.currentShipment.shipmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'delivered',
            notes: deliveryNotes,
            dateDelivered: new Date().toISOString(),
          }),
        }
      )

      if (!shipmentResponse.ok) {
        throw new Error('Failed to update shipment status')
      }

      // 2. Update carrier status to active and clear current shipment
      const carrierResponse = await fetch(
        `/api/carrier/${carrier._id}/delivery-complete`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isActive: true,
            activatedAt: new Date().toISOString(),
          }),
        }
      )

      if (!carrierResponse.ok) {
        throw new Error('Failed to update carrier status')
      }

      const data = await carrierResponse.json()
      setCarrier(data.carrier)

      toast({
        title: 'Delivery Completed',
        description:
          'The shipment has been marked as delivered and you are now available for new deliveries.',
      })

      setShowDeliveredDialog(false)
      setDeliveryNotes('')
      fetchRecentShipments()
    } catch (error) {
      if(error instanceof Error) {  
        console.error('Error marking shipment as delivered:', error)
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark shipment as delivered',
      })
    } finally {
      setIsMarkingDelivered(false)
    }
  }

  const refreshData = () => {
    fetchCarrierProfile()
    fetchRecentShipments()
    toast({
      title: 'Data Refreshed',
      description:
        'Your dashboard has been updated with the latest information.',
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
      </div>
    )
  }

  if (!carrier) {
    return (
      <div className="container mx-auto py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground text-center">
              We couldnt find your carrier profile. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <Truck className="mr-2 h-6 w-6 text-[#4a6bff]" />
          Carrier Dashboard
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={refreshData}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => (window.location.href = '/carrier/edit-profile')}
            className="bg-[#4a6bff] hover:bg-[#3a5bef]"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card
            className={`border-l-4 ${
              carrier.isActive ? 'border-l-green-500' : 'border-l-orange-500'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <User className="mr-2 h-5 w-5 text-[#4a6bff]" />
                  {carrier.name}
                </CardTitle>
                <Badge
                  variant={carrier.isActive ? 'secondary' : 'outline'}
                  className={
                    carrier.isActive
                      ? 'bg-green-100 text-green-800 px-3 py-1'
                      : 'border-orange-500 text-orange-800 px-3 py-1'
                  }
                >
                  {carrier.isActive ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <CardDescription>
                {carrier.isActive
                  ? 'You are currently available to receive delivery assignments.'
                  : 'You are currently unavailable for new deliveries.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {carrier.isActive
                      ? "Toggle off when you're not available for deliveries"
                      : "Toggle on when you're ready to accept deliveries"}
                  </p>
                  {carrier.activatedAt && carrier.isActive && (
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-[#4a6bff]" />
                      Available since:{' '}
                      {new Date(carrier.activatedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {carrier.isActive ? 'Available' : 'Unavailable'}
                  </span>
                  <Switch
                    checked={carrier.isActive}
                    onCheckedChange={handleStatusToggle}
                    disabled={isUpdating || Boolean(carrier.currentShipment)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {carrier.currentShipment && !carrier.isActive && (
            <Card className="border-orange-500 border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="mr-2 h-5 w-5 text-orange-500" />
                  Current Delivery
                </CardTitle>
                <CardDescription>
                  You are currently delivering this shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Order:</span>
                    <span className="text-sm">
                      #{carrier.currentShipment.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tracking:</span>
                    <span className="text-sm font-mono">
                      {carrier.currentShipment.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Delivery:</span>
                    <span className="text-sm">
                      {carrier.currentShipment.estimatedDelivery}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-medium">Update Status:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeliveredDialog(true)}
                      className="border-orange-500 text-orange-800 hover:bg-orange-50"
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-orange-50 flex justify-between">
                <span className="text-xs text-orange-800">
                  Mark as delivered when you complete this shipment
                </span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowDeliveredDialog(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Mark Delivered
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-[#4a6bff]" />
                  Delivery History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="recent">
                  {isLoadingShipments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#4a6bff]" />
                    </div>
                  ) : recentShipments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No recent deliveries found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentShipments.map((shipment) => (
                        <div
                          key={shipment._id}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                Order #{shipment.orderId}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(
                                  shipment.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge
                              className={
                                shipment.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : shipment.status === 'in_transit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }
                            >
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {isLoadingShipments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#4a6bff]" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentShipments
                        .filter((shipment) => shipment.status === 'delivered')
                        .map((shipment) => (
                          <div
                            key={shipment._id}
                            className="border rounded-md p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">
                                  Order #{shipment.orderId}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Delivered:{' '}
                                  {shipment.dateDelivered
                                    ? new Date(
                                        shipment.dateDelivered
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Delivered
                              </Badge>
                            </div>
                          </div>
                        ))}
                      {recentShipments.filter(
                        (shipment) => shipment.status === 'delivered'
                      ).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p>No completed deliveries found</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all">
                  {isLoadingShipments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#4a6bff]" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentShipments.map((shipment) => (
                        <div
                          key={shipment._id}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                Order #{shipment.orderId}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(
                                  shipment.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge
                              className={
                                shipment.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : shipment.status === 'in_transit'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-orange-100 text-orange-800'
                              }
                            >
                              {shipment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-[#4a6bff]" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#4a6bff] mr-2" />
                    <span className="font-medium">{carrier.name}</span>
                  </div>
                  {carrier.contactPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{carrier.contactPhone}</span>
                    </div>
                  )}
                  {carrier.contactEmail && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{carrier.contactEmail}</span>
                    </div>
                  )}
                  {carrier.vehicle && (
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm">{carrier.vehicle}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Delivery Stats</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-3 rounded-md">
                      <div className="text-2xl font-bold text-[#4a6bff]">
                        {recentShipments.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total deliveries
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-md">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          recentShipments.filter(
                            (s) => s.status === 'delivered'
                          ).length
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-[#4a6bff]" />
                Delivery Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-md p-4 text-center">
                <p className="text-sm">
                  {carrier.zone || 'Downtown & Surrounding Areas'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact admin to update your delivery zone
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-[#4a6bff]" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-time rate</span>
                  <span className="text-sm font-medium text-green-600">
                    98%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '98%' }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Customer satisfaction</span>
                  <span className="text-sm font-medium text-green-600">
                    4.9/5
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '97%' }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="link"
                className="text-[#4a6bff] p-0 h-auto text-sm"
              >
                View detailed stats <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showDeliveredDialog} onOpenChange={setShowDeliveredDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>
              Update the status of order #{carrier.currentShipment?.orderNumber}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={shipmentStatus} onValueChange={setShipmentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Add any notes about the delivery..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeliveredDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateShipmentStatus}
              disabled={isUpdating || isMarkingDelivered}
              className={
                shipmentStatus === 'delivered'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-[#4a6bff] hover:bg-[#3a5bef]'
              }
            >
              {isUpdating || isMarkingDelivered ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : shipmentStatus === 'delivered' ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </>
              ) : (
                <>Update Status</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
