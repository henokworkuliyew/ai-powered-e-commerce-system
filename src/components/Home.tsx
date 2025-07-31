'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Package, AlertCircle } from 'lucide-react'
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
  const [error, setError] = useState<string | null>(null)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  )

  const searchQuery = searchParams?.get('q') || ''

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/product'),
          fetch('/api/category'),
        ])

        if (!productsRes.ok) {
          throw new Error('Failed to fetch products')
        }
        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories')
        }

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        if (!productsData.products || !Array.isArray(productsData.products)) {
          console.error('Invalid products data format:', productsData)
          setProducts([])
          setError('Received invalid products data from server')
          return
        }

        if (
          !categoriesData.categories ||
          !Array.isArray(categoriesData.categories)
        ) {
          console.error('Invalid categories data format:', categoriesData)
          setCategories([])
          setError('Received invalid categories data from server')
          return
        }

        const productsList = productsData.products
        setCategories(categoriesData.categories)

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
      } catch (err) {
        console.error('Error fetching data:', err)
        setProducts([])
        setCategories([])
        setError(
          'Failed to load products and categories. Please try again later.'
        )
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
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(
          `https://rec-system-8mee.onrender.com/user/recommendations/${currentUser}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.log(`Failed to fetch recommendations: ${response.status}`)
        }

        const data = await response.json()

        if (!data.recommended_items || !Array.isArray(data.recommended_items)) {
          console.error('Invalid recommendations data format:', data)
          setRecommendations([])
          setError('Received invalid recommendations data from server')
          return
        }

        setRecommendations(data.recommended_items)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setRecommendations([])
        setError('Failed to load recommendations. Please try again later.')
      } finally {
        setRecommendationsLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentUser])

  useEffect(() => {
    setSelectedSubcategory(null)
  }, [selectedCategory])

  const topRatedProducts = useMemo(() => {
    return [...products]
      .filter((product) => product.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5)
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchQuery) {
        const searchTerms = searchQuery
          .toLowerCase()
          .trim()
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

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center p-10">
            <div className="text-center bg-slate-50 p-8 rounded-lg w-full max-w-md">
              <AlertCircle className="mx-auto h-14 w-14 text-rose-600 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                Failed to load data
              </h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-900 px-8 py-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (products.length === 0 && categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center p-10">
            <div className="text-center bg-slate-50 p-8 rounded-lg w-full max-w-md">
              <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">
                No products found
              </h3>
              <p className="text-slate-600 mb-6">
                No products or categories available at the moment.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 py-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

      {currentUser ? (
        <RecommendationsSection
          recommendations={recommendations}
          loading={recommendationsLoading}
          userId={currentUser}
        />
      ) : (
        <RecommendationsSection
          recommendations={[]}
          loading={recommendationsLoading}
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
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-sm">
            <CardContent className="flex items-center justify-center p-10">
              <div className="text-center bg-slate-50 p-8 rounded-lg w-full max-w-md">
                <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-medium text-slate-900 mb-2">
                  No products found
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery
                    ? `No products found matching "${searchQuery}"`
                    : 'No products found in this category.'}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-2"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
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
