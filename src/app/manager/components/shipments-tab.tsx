'use client'
import AddShipmentDialog from '@/components/manager/add-shipment-dialog'
import ViewShipmentDialog from '@/components/manager/view-shipment-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button2'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { shipmentData } from '@/lib/mockData'
import { Download, Plus } from 'lucide-react'
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

interface ShipmentsTabProps {
  searchShipment: string
  setSearchShipment: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  carrierFilter: string
  setCarrierFilter: (value: string) => void
}

export default function ShipmentsTab({
  searchShipment,
  setSearchShipment,
  statusFilter,
  setStatusFilter,
  carrierFilter,
  setCarrierFilter,
}: ShipmentsTabProps) {
  const [showAddShipmentDialog, setShowAddShipmentDialog] = useState(false)
  const [showViewShipmentDialog, setShowViewShipmentDialog] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null
  )

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

  const handleExportShipments = () => {
    alert('Exporting shipment data...')
  }

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowViewShipmentDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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
    <div className="space-y-4">
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
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
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
