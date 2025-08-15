import { type NextRequest, NextResponse } from 'next/server'

import { verifyPayment } from '@/lib/chapa'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'
import { Product } from '@/server/models/Product'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { tx_ref } = body

    const verificationResult = await verifyPayment(tx_ref)

    if (verificationResult.status === 'success') {
      const orderNumber = tx_ref.split('tx-')[1]

      // Idempotency and fetch order items
      const existing = await Order.findOne({ orderNumber }).select(
        'paymentStatus items'
      )
      if (!existing) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      if (existing.paymentStatus === 'completed') {
        return NextResponse.json({ success: true })
      }

      const session = await mongoose.startSession()
      try {
        await session.withTransaction(async () => {
          for (const item of existing.items) {
            const product = await Product.findById(item.productId)
              .session(session)
              .select('quantity inStock')
            if (!product) {
              throw new Error('Product not found')
            }
            if (product.quantity < item.quantity) {
              throw new Error('Insufficient stock for product')
            }
            product.quantity = product.quantity - item.quantity
            product.inStock = product.quantity > 0
            await product.save({ session })
          }

          await Order.updateOne(
            { orderNumber },
            { paymentStatus: 'completed', orderStatus: 'processing' },
            { session }
          )
        })
      } finally {
        session.endSession()
      }

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        redirectUrl: `${process.env.NEXTAUTH_URL}/checkout/orders/${orderNumber}/confirmation`,
      })
    } else {
      
      const orderNumber = tx_ref.split('tx-')[1]
      await Order.findOneAndUpdate({ orderNumber }, { paymentStatus: 'failed' })

      return NextResponse.json(
        {
          error: 'Payment verification failed',
          redirectUrl: `${process.env.NEXTAUTH_URL}/checkout/orders/${orderNumber}/confirmation`,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing payment callback:', error)
    return NextResponse.json(
      { error: 'Failed to process payment callback' },
      { status: 500 }
    )
  }
}
