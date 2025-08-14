import { type NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/chapa'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'
import { Product } from '@/server/models/Product'
import mongoose from 'mongoose'


export async function GET(
  req: NextRequest,
  context: { params: { txRef: string } }
) {
  try {
    const { txRef } = context.params

    const verificationResult = await verifyPayment(txRef)

    if (verificationResult.status === 'success') {
      await dbConnect()

      const orderNumber = txRef.split('tx-')[1]

      // Idempotency check: if already completed, return success
      const existing = await Order.findOne({ orderNumber }).select(
        'paymentStatus items'
      )
      if (!existing) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        )
      }
      if (existing.paymentStatus === 'completed') {
        return NextResponse.json({ success: true })
      }

      // Decrement inventory atomically in a transaction
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

      return NextResponse.json({ success: true, data: verificationResult.data })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
