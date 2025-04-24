'use client'
import EditStockDialog from '@/components/manager/edit-stock-dialog'
import { Button } from '@/components/ui/button2'
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
import products from '@/lib/data'
import type { Product } from '@/type/Product'
import { ArrowUpDown, Download, Plus, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


interface InventoryTabProps {
  searchInventory: string
  setSearchInventory: (value: string) => void
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  locationFilter: string
  setLocationFilter: (value: string) => void
}

export default function InventoryTab({
  searchInventory,
  setSearchInventory,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
}: InventoryTabProps) {
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Product | null>(null)

  const filteredInventory = products.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchInventory.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' ||
      item.category.name.toLowerCase() === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleExportInventory = () => {
    alert('Exporting inventory data...')
  }

  const handleEdit = (item: Product) => {
    setSelectedItem(item)
    setShowEditDialog(true)
  }

  return (
    <div className="space-y-4">
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
                  <TableHead >Available</TableHead>
                  <TableHead>Status</TableHead>
                  {/* <TableHead></TableHead> */}
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
                      <TableCell className="font-medium">{item.id}</TableCell>
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

      {selectedItem && (
        <EditStockDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          item={selectedItem}
        />
      )}
    </div>
  )
}
