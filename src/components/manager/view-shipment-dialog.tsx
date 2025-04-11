import { CalendarIcon, Package, Truck, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button2'
import { useRef, useState } from 'react'

interface ViewShipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment: {
    id: string
    trackingNumber: string
    customer: string
    carrier: string
    dateShipped?: string
    dateDelivered?: string
    items: number
    status: string
  }
}

export function ViewShipmentDialog({
  open,
  onOpenChange,
  shipment,
}: ViewShipmentDialogProps) {
  const [status, setStatus] = useState(shipment?.status || '')
  const printRef = useRef<HTMLDivElement>(null)

  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  const handleUpdateStatus = () => {
    console.log('Status updated to:', status)
    alert(`Shipment status updated to: ${status}`)
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Shipment Details</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .hidden-print { display: none; }
              </style>
            </head>
            <body>${printRef.current.innerHTML}</body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
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

  if (!shipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-200" ref={printRef}>
        <DialogHeader>
          <DialogTitle>Shipment Details</DialogTitle>
          <DialogDescription>
            View and manage shipment information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Shipment ID:</span>
            </div>
            <span>{shipment.id}</span>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Tracking Number:</span>
          </div>
          <span className="font-mono">{shipment.trackingNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Customer:</span>
          </div>
          <span>{shipment.customer}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Carrier:</span>
          </div>
          <span>{shipment.carrier}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Date Shipped:</span>
          </div>
          <span>{shipment.dateShipped || 'Not shipped yet'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">Date Delivered:</span>
          </div>
          <span>{shipment.dateDelivered || 'Not delivered yet'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Number of Items:</span>
          </div>
          <span>{shipment.items}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Current Status:</span>
          </div>
          {getStatusBadge(shipment.status)}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-slate-400">
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
             {}
            }
          >
            Track Shipment
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            Print Label
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ViewShipmentDialog
