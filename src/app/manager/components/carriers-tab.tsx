'use client'

import { useState, useEffect } from 'react'
import {
  Download,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'

interface CarriersTabProps {
  searchCarrier: string
  setSearchCarrier: (value: string) => void
}

interface Carrier {
  _id: string
  name: string
  trackingUrlTemplate: string
  logo?: string
  contactPhone?: string
  contactEmail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CarriersTab({
  searchCarrier,
  setSearchCarrier,
}: CarriersTabProps) {
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)

  // Form state
  const [carrierName, setCarrierName] = useState('')
  const [trackingUrlTemplate, setTrackingUrlTemplate] = useState('')
  const [logo, setLogo] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadCarriers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/carrier')

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setCarriers(data.carriers)
    } catch (error) {
      console.error('Error fetching carriers:', error)
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load carriers. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCarriers()
  }, [])

  const filteredCarriers = carriers.filter((carrier) => {
    return (
      carrier.name.toLowerCase().includes(searchCarrier.toLowerCase()) ||
      carrier._id.toString().includes(searchCarrier) ||
      (carrier.contactEmail &&
        carrier.contactEmail
          .toLowerCase()
          .includes(searchCarrier.toLowerCase())) ||
      (carrier.contactPhone && carrier.contactPhone.includes(searchCarrier))
    )
  })

  const handleExportCarriers = () => {
    if (filteredCarriers.length === 0) {
      toast({
        title: 'No carriers to export',
        description: 'There are no carriers matching your current filters.',
      })
      return
    }

    // Create CSV content
    const headers = [
      'ID',
      'Name',
      'Tracking URL Template',
      'Contact Phone',
      'Contact Email',
      'Status',
      'Created At',
    ]
    const csvContent = [
      headers.join(','),
      ...filteredCarriers.map((carrier) => {
        return [
          carrier._id,
          carrier.name.replace(/,/g, ' '),
          carrier.trackingUrlTemplate.replace(/,/g, ' '),
          carrier.contactPhone || '',
          carrier.contactEmail || '',
          carrier.isActive ? 'Active' : 'Inactive',
          new Date(carrier.createdAt).toLocaleDateString(),
        ].join(',')
      }),
    ].join('\n')

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carriers-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export successful',
      description: `${filteredCarriers.length} carriers exported to CSV.`,
    })
  }

  const resetForm = () => {
    setCarrierName('')
    setTrackingUrlTemplate('')
    setLogo('')
    setContactPhone('')
    setContactEmail('')
    setIsActive(true)
    setSelectedCarrier(null)
  }

  const handleAddCarrier = () => {
    resetForm()
    setShowAddDialog(true)
  }

  const handleEditCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier)
    setCarrierName(carrier.name)
    setTrackingUrlTemplate(carrier.trackingUrlTemplate)
    setLogo(carrier.logo || '')
    setContactPhone(carrier.contactPhone || '')
    setContactEmail(carrier.contactEmail || '')
    setIsActive(carrier.isActive)
    setShowEditDialog(true)
  }

  const handleDeleteCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier)
    setShowDeleteDialog(true)
  }

  const submitAddCarrier = async () => {
    if (!carrierName || !trackingUrlTemplate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/carrier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: carrierName,
          trackingUrlTemplate,
          logo: logo || undefined,
          contactPhone: contactPhone || undefined,
          contactEmail: contactEmail || undefined,
          isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      toast({
        title: 'Carrier added',
        description: `${carrierName} has been successfully added.`,
      })

      resetForm()
      setShowAddDialog(false)
      loadCarriers()
    } catch (error) {
      console.error('Error adding carrier:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to add carrier. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitEditCarrier = async () => {
    if (!selectedCarrier || !carrierName || !trackingUrlTemplate) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/carrier', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carrierId: selectedCarrier._id,
          name: carrierName,
          trackingUrlTemplate,
          logo: logo || undefined,
          contactPhone: contactPhone || undefined,
          contactEmail: contactEmail || undefined,
          isActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      toast({
        title: 'Carrier updated',
        description: `${carrierName} has been successfully updated.`,
      })

      resetForm()
      setShowEditDialog(false)
      loadCarriers()
    } catch (error) {
      console.error('Error updating carrier:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update carrier. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitDeleteCarrier = async () => {
    if (!selectedCarrier) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/carrier?id=${selectedCarrier._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      toast({
        title: 'Carrier deleted',
        description: `${selectedCarrier.name} has been successfully deleted.`,
      })

      setShowDeleteDialog(false)
      loadCarriers()
    } catch (error) {
      console.error('Error deleting carrier:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete carrier. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading carriers: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }   

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search carriers..."
            value={searchCarrier}
            onChange={(e) => setSearchCarrier(e.target.value)}
            className="w-full sm:w-[280px]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCarriers}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddCarrier}>
            <Plus className="mr-2 h-4 w-4" />
            Add Carrier
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
        <CardHeader className="border-b border-indigo-100 bg-indigo-50/50">
          <CardTitle className="text-indigo-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Carrier Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-indigo-100">
                  <TableHead className="w-[80px] text-indigo-900">ID</TableHead>
                  <TableHead className="text-indigo-900">Name</TableHead>
                  <TableHead className="text-indigo-900">
                    Tracking URL
                  </TableHead>
                  <TableHead className="text-indigo-900">Contact</TableHead>
                  <TableHead className="text-indigo-900">Status</TableHead>
                  <TableHead className="text-right text-indigo-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarriers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {carriers.length === 0 ? (
                        <div className="flex flex-col items-center">
                          <p className="mb-2">No carriers found.</p>
                          <Button size="sm" onClick={handleAddCarrier}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add your first carrier
                          </Button>
                        </div>
                      ) : (
                        'No carriers match your search.'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCarriers.map((carrier) => (
                    <TableRow
                      key={carrier._id.toString()}
                      className="hover:bg-indigo-50"
                    >
                      <TableCell className="font-mono text-xs">
                        {carrier._id.toString().substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {carrier.name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {carrier.trackingUrlTemplate}
                      </TableCell>
                      <TableCell>
                        {carrier.contactEmail && (
                          <div className="text-sm">{carrier.contactEmail}</div>
                        )}
                        {carrier.contactPhone && (
                          <div className="text-sm text-muted-foreground">
                            {carrier.contactPhone}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {carrier.isActive ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300"
                          >
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCarrier(carrier)}
                            className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCarrier(carrier)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Carrier Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Carrier</DialogTitle>
            <DialogDescription>
              Add a new shipping carrier to your system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. FedEx, UPS, DHL"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tracking-url" className="text-right">
                Tracking URL *
              </Label>
              <Input
                id="tracking-url"
                value={trackingUrlTemplate}
                onChange={(e) => setTrackingUrlTemplate(e.target.value)}
                className="col-span-3"
                placeholder="e.g. https://example.com/track/{trackingNumber}"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-phone" className="text-right">
                Contact Phone
              </Label>
              <Input
                id="contact-phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="col-span-3"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-email" className="text-right">
                Contact Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="col-span-3"
                placeholder="support@carrier.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is-active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is-active" className="cursor-pointer">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitAddCarrier} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Carrier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Carrier Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Carrier</DialogTitle>
            <DialogDescription>
              Update the carrier information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tracking-url" className="text-right">
                Tracking URL *
              </Label>
              <Input
                id="edit-tracking-url"
                value={trackingUrlTemplate}
                onChange={(e) => setTrackingUrlTemplate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-logo" className="text-right">
                Logo URL
              </Label>
              <Input
                id="edit-logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contact-phone" className="text-right">
                Contact Phone
              </Label>
              <Input
                id="edit-contact-phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-contact-email" className="text-right">
                Contact Email
              </Label>
              <Input
                id="edit-contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-is-active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="edit-is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="edit-is-active" className="cursor-pointer">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitEditCarrier} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Carrier Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Carrier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this carrier? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCarrier && (
              <div className="p-4 border rounded-md bg-red-50">
                <p className="font-medium">{selectedCarrier.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: {selectedCarrier._id.toString().substring(0, 8)}...
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submitDeleteCarrier}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Carrier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
