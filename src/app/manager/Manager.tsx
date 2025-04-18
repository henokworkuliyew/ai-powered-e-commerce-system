'use client'
import AddShipmentDialog from '@/components/manager/add-shipment-dialog'
//import { AddStockDialog } from '@/components/manager/add-stock-dialog'
import EditStockDialog from '@/components/manager/edit-stock-dialog'
import ViewShipmentDialog from '@/components/manager/view-shipment-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button2' // Fixed import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import products from '@/lib/data'
import { orders, shipmentData } from '@/lib/mockData'
import type { Product } from '@/type/Product'
import { ArrowUpDown, Download, Plus, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Shipment {
  id: string
  trackingNumber: string
  customer: string
  carrier: string
  dateShipped?: string
  dateDelivered?: string
  items: number
  status: string
}

const Manager = () => {
  const router = useRouter()

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddShipmentDialog, setShowAddShipmentDialog] = useState(false)
  const [showViewShipmentDialog, setShowViewShipmentDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Product | null>(null)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  )
  const [searchInventory, setSearchInventory] = useState('')
  const [searchOrders, setSearchOrders] = useState('')
  const [searchShipment, setSearchShipment] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [carrierFilter, setCarrierFilter] = useState('all')

  const filteredInventory = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchInventory.toLowerCase())
    // item.sku.toLowerCase().includes(searchInventory.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' || item.category.name.toLowerCase() === categoryFilter
    //   const matchesLocation =
    //     locationFilter === 'all' ||
    //     (locationFilter === 'warehouseA' && item.location === 'Warehouse A') ||
    //     (locationFilter === 'warehouseB' && item.location === 'Warehouse B') ||
    //     (locationFilter === 'warehouseC' && item.location === 'Warehouse C')

    return matchesSearch && matchesCategory
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchOrders.toLowerCase()) ||
      order.id.toLowerCase().includes(searchOrders.toLowerCase())
    return matchesSearch
  })

  const filteredShipments = shipmentData.filter((shipment) => {
    const matchesSearch =
      shipment.customer.toLowerCase().includes(searchShipment.toLowerCase()) ||
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchShipment.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'delivered' && shipment.status === 'Delivered') ||
      (statusFilter === 'intransit' && shipment.status === 'In Transit') ||
      (statusFilter === 'processing' && shipment.status === 'Processing')
    const matchesCarrier =
      carrierFilter === 'all' ||
      shipment.carrier.toLowerCase() === carrierFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesCarrier
  })

  const handleExportInventory = () => {
    alert('Exporting inventory data...')
  }

  const handleEdit = (item: Product) => {
    setSelectedItem(item)
    setShowEditDialog(true)
  }

  const handleExportShipments = () => {
    alert('Exporting shipment data...')
  }

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowViewShipmentDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-500">In Stock</Badge>
      case 'Low Stock':
        return <Badge className="bg-yellow-500">Low Stock</Badge>
      case 'Out of Stock':
        return <Badge className="bg-red-500">Out of Stock</Badge>
      case 'Delivered':
        return <Badge className="bg-green-500">Delivered</Badge>
      case 'In Transit':
        return <Badge className="bg-blue-500">In Transit</Badge>
      case 'Processing':
        return <Badge className="bg-yellow-500">Processing</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8  bg-slate-50">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Shipping & Stock Management
        </h2>
      </div>
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Input
                placeholder="Search inventory..."
                className="w-full md:w-[300px]"
                value={searchInventory}
                onChange={(e) => setSearchInventory(e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[200px]">
                  <DropdownMenuCheckboxItem checked>
                    Low Stock Items
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Out of Stock Items
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>
                    In Stock Items
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Select
                defaultValue="all"
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue="all"
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="warehouseA">Warehouse A</SelectItem>
                  <SelectItem value="warehouseB">Warehouse B</SelectItem>
                  <SelectItem value="warehouseC">Warehouse C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Button variant="outline" onClick={handleExportInventory}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => router.push('manager/product')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-200">
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Product</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>In Stock</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.id}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.category.name}</TableCell>
                          <TableCell>{item.inStock}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>{item.inStock}</TableCell>
                          
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shipments" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Input
                placeholder="Search shipments..."
                className="w-full md:w-[300px]"
                value={searchShipment}
                onChange={(e) => setSearchShipment(e.target.value)}
              />
              <Select
                defaultValue="all"
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="intransit">In Transit</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue="all"
                value={carrierFilter}
                onValueChange={setCarrierFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Carriers</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Button variant="outline" onClick={handleExportShipments}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddShipmentDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Shipment
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-200">
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Date Shipped</TableHead>
                      <TableHead>Date Delivered</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">
                            {shipment.id}
                          </TableCell>
                          <TableCell>{shipment.trackingNumber}</TableCell>
                          <TableCell>{shipment.customer}</TableCell>
                          <TableCell>
                            {getStatusBadge(shipment.status)}
                          </TableCell>
                          <TableCell>{shipment.carrier}</TableCell>
                          <TableCell>{shipment.dateShipped || '—'}</TableCell>
                          <TableCell>{shipment.dateDelivered || '—'}</TableCell>
                          <TableCell className="text-right">
                            {shipment.items.toString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewShipment(shipment)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Input
                placeholder="Search Orders..."
                className="w-full md:w-[300px]"
                value={searchOrders}
                onChange={(e) => setSearchOrders(e.target.value)}
              />
              <Select
                defaultValue="all"
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:space-x-2">
              <Button variant="outline" onClick={handleExportInventory}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              {/* <Button variant="outline" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button> */}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-200">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items.join(', ')}</TableCell>
                          <TableCell>{order.total.toString()}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedItem && (
        <EditStockDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
        />
      )}
      <AddShipmentDialog
        open={showAddShipmentDialog}
        onOpenChange={setShowAddShipmentDialog}
      />
      {selectedShipment && (
        <ViewShipmentDialog
          open={showViewShipmentDialog}
          onOpenChange={setShowViewShipmentDialog}
          shipment={selectedShipment}
        />
      )}
    </div>
  )
}

export default Manager
