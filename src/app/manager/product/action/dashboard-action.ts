'use server'

import dbConnect from '@/lib/dbConnect'
import Carrier from '@/server/models/Carrier'
import Order from '@/server/models/Order'
import { Product } from '@/server/models/Product'
import { Shipment } from '@/server/models/Shipment'
import { revalidatePath } from 'next/cache'


export async function fetchDashboardStats() {
  try {
    await dbConnect()

    // Get total inventory count and calculate percent change
    // For percent change, we'd typically compare with a previous period
    // Here we're just getting the current count
    const totalInventory = await Product.aggregate([
      { $group: { _id: null, count: { $sum: '$quantity' } } },
    ])

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' })

    // Get active shipments (processing or in_transit)
    const activeShipments = await Shipment.countDocuments({
      status: { $in: ['processing', 'in_transit'] },
    })

    // Get active carriers
    const activeCarriers = await Carrier.countDocuments({ isActive: true })

    // Calculate monthly revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        },
      },
    ])

    // For percent changes, we would compare with previous periods
    // Here we're using placeholder values
    return {
      totalInventory: {
        count: totalInventory.length > 0 ? totalInventory[0].count : 0,
        percentChange: 5.2, // Placeholder - would calculate from previous period
      },
      pendingOrders: {
        count: pendingOrders,
        percentChange: -12.5, // Placeholder
      },
      activeShipments: {
        count: activeShipments,
        percentChange: 8.7, // Placeholder
      },
      monthlyRevenue: {
        amount: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
        percentChange: 15.3, // Placeholder
      },
      activeCarriers: {
        count: activeCarriers,
        percentChange: 0, // Placeholder
      },
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard statistics')
  }
}

// Revalidate the dashboard path to refresh the data
export async function refreshDashboard() {
  revalidatePath('/manager')
  return { success: true }
}
