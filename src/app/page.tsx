'use client'

import { useState, useEffect } from 'react'
import Loading from '@/components/Loading'
import { ProductCard } from '@/components/ProductCard/productCard'
import type { Product } from '@/type/Product'
import CategoryFilter from '@/components/category/CategoryFilter'
import type { Category } from '@/type/category'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/product`, {
            cache: 'no-store',
          }),
          fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/category`, {
            cache: 'no-store',
          }),
        ])

        if (!productsRes.ok) throw new Error('Failed to fetch products')
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories')

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setSelectedSubcategory(null)
  }, [selectedCategory])

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') {
      return true
    }

    if (product.category.name !== selectedCategory) {
      return false
    }

    // If a subcategory is selected, check if the product belongs to this subcategory
    if (selectedSubcategory) {
      if (product.category.subCategories) {
        return product.category.subCategories.includes(selectedSubcategory)
      }

      const productText = `${product.name} ${product.description}`.toLowerCase()
      const subcategoryWords = selectedSubcategory.toLowerCase().split(' ')

      // Check if any of the subcategory words are in the product text
      return subcategoryWords.some(
        (word) => word.length > 3 && productText.includes(word)
      )
    }

    // If no subcategory is selected, show all products in the category
    return true
  })

  const displayTitle =
    selectedCategory === 'all'
      ? 'All Products'
      : selectedSubcategory
      ? `${selectedCategory} - ${selectedSubcategory}`
      : selectedCategory

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
        productCounts={getCategoryCounts(products)}
      />

      <h2 className="text-2xl font-bold mt-8 mb-6">{displayTitle}</h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-8 w-full sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            No products found in this category.
          </p>
          <p className="mt-2 text-gray-400">
            Try selecting a different category or subcategory.
          </p>
        </div>
      )}
    </div>
  )
}

// Helper function to count products in each category
function getCategoryCounts(products: Product[]) {
  const counts: Record<string, number> = { all: products.length }

  products.forEach((product) => {
    const category = product.category.name
    counts[category] = (counts[category] || 0) + 1
  })

  return counts
}
