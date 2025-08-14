import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { Product } from '@/server/models/Product'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { stock } = body

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json(
        { error: 'Stock must be a non-negative number' },
        { status: 400 }
      )
    }

    await dbConnect()
    const product = await Product.findByIdAndUpdate(
      id,
      { stock },
      { new: true }
    )

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product stock:', error)
    return NextResponse.json(
      { error: 'Failed to update product stock' },
      { status: 500 }
    )
  }
}
