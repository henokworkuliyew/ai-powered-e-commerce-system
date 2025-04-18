'use client'

import Loading from '@/components/Loading'
import { ProductCard } from '@/components/ProductCard/productCard'
import { Product } from '@/type/Product'
import { useState, useEffect } from 'react'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/product`,
          {
            cache: 'no-store',
          }
        )

        if (!res.ok) throw new Error('Failed to fetch')

        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="grid grid-cols-2 gap-8 w-full sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  )
}
