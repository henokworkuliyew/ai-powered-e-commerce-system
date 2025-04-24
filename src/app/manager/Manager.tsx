"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import InventoryTab from "./components/inventory-tab"
import ShipmentsTab from "./components/shipments-tab"
import OrdersTab from "./components/orders-tab"


const Manager = () => {
  const [searchInventory, setSearchInventory] = useState("")
  const [searchOrders, setSearchOrders] = useState("")
  const [searchShipment, setSearchShipment] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [carrierFilter, setCarrierFilter] = useState("all")

  return (
    <div className="flex-1 space-y-4 p-8 bg-slate-50">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shipping & Stock Management</h2>
      </div>
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryTab
            searchInventory={searchInventory}
            setSearchInventory={setSearchInventory}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
          />
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <ShipmentsTab
            searchShipment={searchShipment}
            setSearchShipment={setSearchShipment}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            carrierFilter={carrierFilter}
            setCarrierFilter={setCarrierFilter}
          />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTab
            searchOrders={searchOrders}
            setSearchOrders={setSearchOrders}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Manager
