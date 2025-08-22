import ProductDetail from '../ProductDetail'
import { getCurrentUser } from '@/action/CurrentUser'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  if (!id) {
    return <div className="text-red-500">Invalid product ID</div>
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/product/${id}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    return (
      <div className="text-red-500">
        Failed to fetch product: {res.statusText}
      </div>
    )
  }

  const productData = await res.json()

  if (!productData) {
    return <div>Product not found</div>
  }

  const currentUser = await getCurrentUser()
  const userId = currentUser?._id || null

  return (
    <div className="grid grid-cols-1 gap-11 p-3" suppressHydrationWarning>
      <ProductDetail product={productData} userId={userId} />
    </div>
  )
}
