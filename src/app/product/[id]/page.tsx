import { Suspense } from 'react'
import ProductDetail from '../ProductDetail'
import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import { Product } from '@/server/models/Product'
import { notFound } from 'next/navigation'
import { serializeProduct } from '@/lib/utils/serialization'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function ProductDetailWrapper({ id }: { id: string }) {
  try {
    await dbConnect()
    const productData = await Product.findById(id).populate('category').lean()

    if (!productData) {
      notFound()
    }

    // Use the serialization utility
    const serializedProduct = serializeProduct(productData)

    const currentUser = await getCurrentUser()
    const userId = currentUser?._id || null

    return <ProductDetail product={serializedProduct} userId={userId} />
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to load product')
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return (
    <div className="grid grid-cols-1 gap-11 p-3" suppressHydrationWarning>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading product...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch the product details.</p>
          </div>
        </div>
      }>
        <ProductDetailWrapper id={id} />
      </Suspense>
    </div>
  )
}
