

import dbConnect from "@/lib/dbConnect"
import { Product } from "@/server/models/Product"
import { NextRequest, NextResponse } from "next/server"
import { serializeProduct } from "@/lib/utils/serialization"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await dbConnect()
    const product = await Product.findById(id).populate('category').lean()
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Serialize product for client components
    const serializedProduct = serializeProduct(product)

    return NextResponse.json(serializedProduct, { status: 200 })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
