'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3,
  BoxIcon,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Truck,
} from 'lucide-react'
import InventoryTab from './components/inventory-tab'
import OrdersTab from './components/orders-tab'
import ShipmentsTab from './components/shipments-tab'
import CarriersTab from './components/carriers-tab'
import { Button } from '@/components/ui/button2'
import { fetchDashboardStats } from './product/action/dashboard-action'


interface DashboardStats {
  totalInventory: {
    count: number
    percentChange: number
  }
  pendingOrders: {
    count: number
    percentChange: number
  }
  activeShipments: {
    count: number
    percentChange: number
  }
  monthlyRevenue: {
    amount: number
    percentChange: number
  }
  activeCarriers: {
    count: number
    percentChange: number
  }
}

export default function Manager() {
  const [searchInventory, setSearchInventory] = useState('')
  const [searchOrders, setSearchOrders] = useState('')
  const [searchShipment, setSearchShipment] = useState('')
  //const [searchCarrier, setSearchCarrier] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardStats = async () => {
    setIsLoading(true)
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadDashboardStats()
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-gray-100">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
          Stock & Shipping Management
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || refreshing}
          className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Dashboard Overview */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-400">
              Error loading dashboard data: {error}
            </p>
          </div>
        </div>
      ) : stats ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Inventory
              </CardTitle>
              <BoxIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stats.totalInventory.count.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`flex items-center ${
                    stats.totalInventory.percentChange >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stats.totalInventory.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.totalInventory.percentChange).toFixed(1)}%
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pending Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stats.pendingOrders.count}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`flex items-center ${
                    stats.pendingOrders.percentChange >= 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  {stats.pendingOrders.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.pendingOrders.percentChange).toFixed(1)}%
                </span>{' '}
                from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Shipments
              </CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stats.activeShipments.count}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`flex items-center ${
                    stats.activeShipments.percentChange >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stats.activeShipments.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.activeShipments.percentChange).toFixed(1)}%
                </span>{' '}
                from last week
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Carriers
              </CardTitle>
              <Truck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stats.activeCarriers.count}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`flex items-center ${
                    stats.activeCarriers.percentChange >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stats.activeCarriers.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.activeCarriers.percentChange).toFixed(1)}%
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Revenue
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                $
                {stats.monthlyRevenue.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span
                  className={`flex items-center ${
                    stats.monthlyRevenue.percentChange >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stats.monthlyRevenue.percentChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stats.monthlyRevenue.percentChange).toFixed(1)}%
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Main Tabs */}
      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="shipments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors"
          >
            Shipments
          </TabsTrigger>
          <TabsTrigger
            value="carriers"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors"
          >
            Carriers
          </TabsTrigger>
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

        <TabsContent value="orders" className="space-y-4">
          <OrdersTab
            searchOrders={searchOrders}
            setSearchOrders={setSearchOrders}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
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

        <TabsContent value="carriers" className="space-y-4">
          <CarriersTab
           
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
