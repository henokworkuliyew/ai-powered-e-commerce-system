import { NextResponse } from 'next/server'
import Order from '@/server/models/Order'
import { generateOrderNumber } from '@/lib/utils'

import dbConnect from '@/lib/dbConnect'

import { getCurrentUser } from '@/action/CurrentUser'

export async function POST(request: Request) {
  try {
    
    const currentUser = await getCurrentUser()
    const data = await request.json()
    console.log('Received data:', data)
    // Connect to the database
    await dbConnect()

    // Generate a unique order number
    const orderNumber = generateOrderNumber()
     
    const order = new Order({
      userId: currentUser._id,
      orderNumber,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      shippingAddressId: data.shippingAddressId,
      billingAddressId: data.billingAddressId,
      notes: data.notes,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    })

    await order.save()

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) 
  {
    if (error instanceof Error) {
      console.error('Error creating order:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    else {
      console.error('Error creating order:', error)
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    
    }
}
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    await dbConnect()
    
    if (orderId) {
      
      const order = await Order.findOne({
        _id: orderId,
        userId: currentUser._id,
      })
    
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json({ order })
    } else {
      // Get all orders for the user
      const orders = await Order.find({ userId: currentUser._id }).sort({
        createdAt: -1,
      })

      return NextResponse.json({ orders })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching orders:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }
  }
}
