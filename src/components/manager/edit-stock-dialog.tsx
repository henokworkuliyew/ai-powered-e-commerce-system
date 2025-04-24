'use client'

import type React from 'react'

import { useState } from 'react'
import type { Product } from '@/type/Product'
import { Button } from '@/components/ui/button2'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface EditStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Product
}

const EditStockDialog: React.FC<EditStockDialogProps> = ({
  open,
  onOpenChange,
  item,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    brand: item?.brand || '',
    category: item?.category || '',
    inStock: item?.inStock || 'In Stock',
    quantity:item?.quantity || 0,
    _id:item?._id||''
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    // In a real application, this would update the product in the database
    console.log('Updated product:', formData)
    alert('Product updated successfully!')
    onOpenChange(false)
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details and inventory information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-id" className="text-right">
              ID
            </Label>
            <Input
              id="product-id"
              value={item._id}
              className="col-span-3"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-name" className="text-right">
              Name
            </Label>
            <Input
              id="product-name"
              value={formData.name}
              className="col-span-3"
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-description" className="text-right">
              Description
            </Label>
            <Input
              id="product-description"
              value={formData.description}
              className="col-span-3"
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-price" className="text-right">
              Price
            </Label>
            <Input
              id="product-price"
              type="number"
              value={formData.price}
              className="col-span-3"
              onChange={(e) =>
                handleChange('price', Number.parseFloat(e.target.value))
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-brand" className="text-right">
              Brand
            </Label>
            <Input
              id="product-brand"
              value={formData.brand}
              className="col-span-3"
              onChange={(e) => handleChange('brand', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-category" className="text-right">
              Category
            </Label>
            <Select
             
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-stock" className="text-right">
              Stock Status
            </Label>
            <Select
              
              onValueChange={(value) => handleChange('inStock', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditStockDialog
