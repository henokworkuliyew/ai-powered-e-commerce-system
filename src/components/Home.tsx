'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/Loading'
import { ProductCard } from '@/components/ProductCard/productCard'
import type { Product } from '@/type/Product'
import CategoryFilter from '@/components/category/CategoryFilter'
import type { Category } from '@/type/category'
import RecommendationsSection from '@/components/recomendation/RecommendationsSection'

interface HomeProps {
  currentUser: string | null
}

interface ProductWithRating extends Product {
  averageRating: number
  totalReviews: number
}

export default function Home({ currentUser }: HomeProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductWithRating[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  )

  const searchQuery = searchParams?.get('q') || ''

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

        const productsList = productsData.products || []
        setCategories(categoriesData.categories || [])

        // Fetch ratings for each product
        const productsWithRatings = await Promise.all(
          productsList.map(async (product: Product) => {
            try {
              const response = await fetch(
                `/api/product/review?productId=${product._id}`
              )
              if (!response.ok) {
                throw new Error('Failed to fetch reviews')
              }
              const data = await response.json()
              const stats = data.stats || { averageRating: 0, totalReviews: 0 }
              return {
                ...product,
                averageRating: stats.averageRating,
                totalReviews: stats.totalReviews,
              }
            } catch (err) {
              console.error(
                `Error fetching reviews for product ${product._id}:`,
                err
              )
              return { ...product, averageRating: 0, totalReviews: 0 }
            }
          })
        )

        setProducts(productsWithRatings)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser) {
        setRecommendations([])
        return
      }

      try {
        setRecommendationsLoading(true)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(
          `https://rec-system-8mee.onrender.com/user/recommendations/${currentUser}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
            signal: controller.signal,
          }
        )

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          console.log('Recommendations Response:', data)
          if (data.recommended_items && Array.isArray(data.recommended_items)) {
            setRecommendations(data.recommended_items)
          } else {
            console.log('No recommended items found in response')
            setRecommendations([])
          }
        } else {
          console.warn('Failed to fetch recommendations:', response.status)
          setRecommendations([])
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        setRecommendations([])
      } finally {
        setRecommendationsLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentUser])

  useEffect(() => {
    setSelectedSubcategory(null)
  }, [selectedCategory])

  // Get top 5 products with highest ratings
  const topRatedProducts = useMemo(() => {
    return [...products]
      .filter((product) => product.averageRating > 0) // Only include products with ratings
      .sort((a, b) => b.averageRating - a.averageRating) // Sort by rating (highest first)
      .slice(0, 5) // Take only the top 5
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchQuery) {
        const searchTerms = searchQuery
          .toLowerCase()
          .split(/\s+/)
          .filter((term) => term.length > 1)

        if (searchTerms.length > 0) {
          const productText = [
            product.name || '',
            product.description || '',
            product.brand || '',
            product.category?.name || '',
            ...(product.category?.subCategories || []),
            ...(product.images?.map((img) => img.color || '') || []),
          ]
            .join(' ')
            .toLowerCase()

          const matchesSearch = searchTerms.some((term) =>
            productText.includes(term)
          )

          if (!matchesSearch) return false
        }
      }

      if (selectedCategory === 'all') {
        return true
      }

      const productCategoryName = product.category?.name
      if (!productCategoryName || productCategoryName !== selectedCategory) {
        return false
      }

      if (selectedSubcategory) {
        const subCategories = product.category?.subCategories || []
        if (subCategories.includes(selectedSubcategory)) {
          return true
        }

        const productText = `${product.name || ''} ${
          product.description || ''
        }`.toLowerCase()
        const subcategoryWords = selectedSubcategory.toLowerCase().split(/\s+/)

        return subcategoryWords.some(
          (word) => word.length > 3 && productText.includes(word)
        )
      }

      return true
    })
  }, [products, selectedCategory, selectedSubcategory, searchQuery])

  const displayTitle = useMemo(() => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`
    }

    return selectedCategory === 'all'
      ? 'All Products'
      : selectedSubcategory
      ? `${selectedCategory} - ${selectedSubcategory}`
      : selectedCategory
  }, [selectedCategory, selectedSubcategory, searchQuery])

  if (loading) return <Loading />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSubcategory={setSelectedSubcategory}
          productCounts={getCategoryCounts(products)}
        />
      </div>

      {/* Show recommendations if user is logged in, otherwise show top rated products */}
      {currentUser ? (
        <RecommendationsSection
          recommendations={recommendations}
          loading={recommendationsLoading}
          userId={currentUser}
        />
      ) : (
        <RecommendationsSection
          recommendations={[]}
          loading={loading}
          userId={null}
          topRatedProducts={topRatedProducts}
          showTopRated={true}
        />
      )}

      <h2 className="text-2xl font-bold mt-8 mb-6">{displayTitle}</h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-8 w-full sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              userId={currentUser || null}
              averageRating={product.averageRating}
              totalReviews={product.totalReviews}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : 'No products found in this category.'}
          </p>
          <p className="mt-2 text-gray-400">
            Try{' '}
            {searchQuery
              ? 'a different search term'
              : 'selecting a different category or subcategory'}
            .
          </p>
        </div>
      )}
    </div>
  )
}

function getCategoryCounts(products: ProductWithRating[]) {
  const counts: Record<string, number> = { all: products.length }

  products.forEach((product) => {
    const category = product.category?.name || ''
    if (category) {
      counts[category] = (counts[category] || 0) + 1
    }
  })

  return counts
}
