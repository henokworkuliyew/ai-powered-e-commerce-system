'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  Search,
  Plus,
  Truck,
  CheckCircle,
  Package,
  Filter,
  RefreshCw,
  UserCog,
  MapPin,
} from 'lucide-react'
import type { Carrier } from '@/type/Carrier'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AddCarrierDialog from '@/components/manager/add-new-cerrier'


export default function CarrierManagementPage() {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterZone, setFilterZone] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [showAddCarrierDialog, setShowAddCarrierDialog] = useState(false)
  const { toast } = useToast()
  

  const fetchCarriers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/carrier')
      if (!response.ok) {
        throw new Error('Failed to fetch carriers')
      }
      const data = await response.json()
      setCarriers(data.carriers || [])
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        })
      }
      console.error('Error fetching carriers:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load carriers',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCarriers()
  }, [])

  const handleStatusToggle = async (
    carrierId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/carrier/${carrierId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
          // If becoming active, set the activation time
          ...(currentStatus === false
            ? { activatedAt: new Date().toISOString() }
            : {}),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update carrier status')
      }

      // Update the local state
      setCarriers((prevCarriers) =>
        prevCarriers.map((carrier) =>
          carrier._id === carrierId
            ? {
                ...carrier,
                isActive: !currentStatus,
                ...(currentStatus === false
                  ? { activatedAt: new Date().toISOString() }
                  : {}),
              }
            : carrier
        )
      )

      toast({
        title: 'Status Updated',
        description: `Carrier is now ${!currentStatus ? 'active' : 'inactive'}`,
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        })
      }
      console.error('Error updating carrier status:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update carrier status',
      })
    }
  }

  const handleCarrierAdded = () => {
    fetchCarriers()
    toast({
      title: 'Success',
      description: 'New carrier has been added to the system',
    })
  }

  // Filter carriers based on search query and zone filter
  const filteredCarriers = carriers
    .filter(
      (carrier) =>
        carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (carrier.contactPhone && carrier.contactPhone.includes(searchQuery)) ||
        (carrier.contactEmail &&
          carrier.contactEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    )
    .filter((carrier) => filterZone === 'all' || carrier.zone === filterZone)
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'status') {
        return Number(b.isActive) - Number(a.isActive)
      } else if (sortBy === 'activation') {
        if (!a.activatedAt && !b.activatedAt) return 0
        if (!a.activatedAt) return 1
        if (!b.activatedAt) return -1
        return (
          new Date(a.activatedAt).getTime() - new Date(b.activatedAt).getTime()
        )
      }
      return 0
    })

  const activeCarriers = filteredCarriers.filter((carrier) => carrier.isActive)
  const inactiveCarriers = filteredCarriers.filter(
    (carrier) => !carrier.isActive
  )

  // Get unique zones for filter dropdown
  const zones = Array.from(
    new Set(carriers.map((carrier) => carrier.zone).filter(Boolean))
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <UserCog className="mr-2 h-6 w-6 text-[#4a6bff]" />
          Carrier Management
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchCarriers}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowAddCarrierDialog(true)}
            className="bg-[#4a6bff] hover:bg-[#3a5bef]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Carrier
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Carriers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-50">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Carriers
                  </p>
                  <p className="text-2xl font-bold">{carriers.length}</p>
                </div>
                <Truck className="h-8 w-8 text-[#4a6bff] opacity-70" />
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Carriers
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeCarriers.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-70" />
              </CardContent>
            </Card>
            <Card className="bg-orange-50">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Shipping</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {inactiveCarriers.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-orange-500 opacity-70" />
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Zones
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {zones.length || 1}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500 opacity-70" />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search carriers by name, phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 border-[#e0e4e8] focus-visible:ring-[#4a6bff]"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select value={filterZone} onValueChange={setFilterZone}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Zone</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone || 'all'}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Sort By</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="activation">Activation Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All Carriers ({filteredCarriers.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeCarriers.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Shipping ({inactiveCarriers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <CarrierTable
                carriers={filteredCarriers}
                onStatusToggle={handleStatusToggle}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="active">
              <CarrierTable
                carriers={activeCarriers}
                onStatusToggle={handleStatusToggle}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="inactive">
              <CarrierTable
                carriers={inactiveCarriers}
                onStatusToggle={handleStatusToggle}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddCarrierDialog
        open={showAddCarrierDialog}
        onOpenChange={setShowAddCarrierDialog}
        onCarrierAdded={handleCarrierAdded}
      />
    </div>
  )
}

interface CarrierTableProps {
  carriers: Carrier[]
  onStatusToggle: (carrierId: string, currentStatus: boolean) => void
  isLoading: boolean
}

function CarrierTable({
  carriers,
  onStatusToggle,
  isLoading,
}: CarrierTableProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
      </div>
    )
  }

  if (carriers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>No carriers found matching your filters</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Current Delivery</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carriers.map((carrier) => (
            <TableRow key={carrier._id}>
              <TableCell className="font-medium">{carrier.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={carrier.isActive ? 'secondary' : 'outline'}
                    className={
                      carrier.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'border-orange-500 text-orange-800'
                    }
                  >
                    {carrier.isActive ? 'Active' : 'Shipping'}
                  </Badge>
                  {carrier.activatedAt && carrier.isActive && (
                    <span className="text-xs text-muted-foreground">
                      since {new Date(carrier.activatedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {carrier.contactPhone && (
                    <div className="text-muted-foreground">
                      {carrier.contactPhone}
                    </div>
                  )}
                  {carrier.contactEmail && (
                    <div className="text-xs text-muted-foreground">
                      {carrier.contactEmail}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{carrier.zone || 'All zones'}</TableCell>
              <TableCell>
                {carrier.currentShipment ? (
                  <div className="text-sm">
                    <div className="font-medium">
                      #{carrier.currentShipment.orderNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {carrier.currentShipment.estimatedDelivery}
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Switch
                    checked={carrier.isActive}
                    onCheckedChange={() =>
                      onStatusToggle(carrier._id, carrier.isActive)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/carriers/${carrier._id}`)
                        }
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/carriers/${carrier._id}/edit`)
                        }
                      >
                        Edit Carrier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/admin/carriers/${carrier._id}/shipments`
                          )
                        }
                      >
                        View Shipments
                      </DropdownMenuItem>
                      {carrier.currentShipment && (
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/admin/shipments/${carrier.currentShipment?.shipmentId}`
                            )
                          }
                        >
                          Track Current Shipment
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
