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
    
   
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    })
    
    const productsPromise = Product.find({ inStock: true })
      .populate('category')
      .lean()
      .exec()
    
    const products = await Promise.race([productsPromise, timeoutPromise])

    if (!products || !Array.isArray(products)) {
      console.error('Invalid products data received')
      return NextResponse.json(
        { error: 'Invalid data received from database' },
        { status: 500 }
      )
    }

    // Serialize products for client components
    const serializedProducts = serializeProducts(products)

    console.log('Fetched products:', serializedProducts.length)

    // Add cache headers for better performance
    const response = NextResponse.json({ products: serializedProducts }, { status: 200 })
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    
    return response
  } catch (error) {
    console.error('Error fetching products:', error)
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: errorMessage,
        retryAfter: 30
      },
      { status: 500 }
    )
  }
}
