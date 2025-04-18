import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button2'
import { CalendarIcon, Plus } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { cn } from '@/hooks/utils/cn'

interface AddShipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  trackingNumber: string
  customer: string
  status: string
  carrier: string
  dateShipped: Date | null
  items: string
}

export default function AddShipmentDialog({
  open,
  onOpenChange,
}: AddShipmentDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    trackingNumber: '',
    customer: '',
    status: '',
    carrier: '',
    dateShipped: null,
    items: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, dateShipped: date || null }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('New shipment created successfully!')
    onOpenChange(false)
    setFormData({
      trackingNumber: '',
      customer: '',
      status: '',
      carrier: '',
      dateShipped: null,
      items: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-200 text-foreground">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>
            Add a new shipment to your tracking system. Fill in all the details
            and click create when you are done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackingNumber" className="text-right">
                Tracking Number
              </Label>
              <Input
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carrier" className="text-right">
                Carrier
              </Label>
              <Select
                value={formData.carrier}
                onValueChange={(value) => handleSelectChange('carrier', value)}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                  <SelectItem value="UPS">UPS</SelectItem>
                  <SelectItem value="USPS">USPS</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateShipped" className="text-right">
                Date Shipped
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.dateShipped && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateShipped
                        ? format(formData.dateShipped, 'PPP')
                        : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateShipped || undefined}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="items" className="text-right">
                Number of Items
              </Label>
              <Input
                id="items"
                name="items"
                type="number"
                min="1"
                value={formData.items}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Shipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
