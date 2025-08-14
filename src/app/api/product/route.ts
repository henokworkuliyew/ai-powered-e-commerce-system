import dbConnect from '@/lib/dbConnect'
import { Product } from '@/server/models/Product'
import { NextResponse } from 'next/server'
import { serializeProducts } from '@/lib/utils/serialization'

export async function POST(req: Request) {
  try {
    await dbConnect()
    const body = await req.json()
    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find().populate('category').lean()

    // Serialize products for client components
    const serializedProducts = serializeProducts(products)

    console.log('Fetched products:', serializedProducts.length)

    return NextResponse.json({ products: serializedProducts }, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
