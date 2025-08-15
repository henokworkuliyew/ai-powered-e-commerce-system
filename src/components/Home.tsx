'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
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
import { useReduxProducts } from '@/hooks/useReduxProducts'
import { useReduxUser } from '@/hooks/useReduxUser'
import Chatbot from '@/components/chatbot'

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
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  )

 
  const { 
    setProducts: setReduxProducts, 
    setLoading: setReduxLoading, 
    setError: setReduxError,
    isLoading: reduxLoading,
    error: reduxError
  } = useReduxProducts()
  const { setCurrentUser } = useReduxUser()

  const searchQuery = searchParams?.get('q') || ''

  
  useEffect(() => {
    // Don't set currentUser in Redux for now to avoid TypeScript issues
    // The currentUser prop is passed directly to components that need it
  }, [currentUser, setCurrentUser])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setReduxLoading(true)

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

      // Optimize review fetching with better error handling
      const productsWithRatings = await Promise.allSettled(
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
            return {
              ...product,
              averageRating: 0,
              totalReviews: 0,
            }
          }
        })
      )

      const successfulProducts = productsWithRatings
        .filter((result) => result.status === 'fulfilled')
        .map((result) => (result as PromiseFulfilledResult<ProductWithRating>).value)

      setProducts(successfulProducts)
      setReduxProducts(productsList) // Store in Redux without ratings for other components
      setReduxError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setReduxError(errorMessage)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
      setReduxLoading(false)
    }
  }, [setReduxProducts, setReduxLoading, setReduxError])

  // Fetch recommendations for logged-in users only
  const fetchRecommendations = useCallback(async () => {
    if (!currentUser) {
      setRecommendations([])
      setRecommendationsLoading(false)
      return
    }

    try {
      setRecommendationsLoading(true)
      setRecommendationsError(null)

      const response = await fetch(`/api/product/recommendations?userId=${currentUser}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      
      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations)
      } else {
        setRecommendations([])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recommendations'
      setRecommendationsError(errorMessage)
      console.error('Error fetching recommendations:', err)
    } finally {
      setRecommendationsLoading(false)
    }
  }, [currentUser])

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Fetch recommendations when user changes
  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.category.name === selectedCategory
      )
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter((product) =>
        product.category.subCategories?.includes(selectedSubcategory)
      )
    }

    return filtered
  }, [products, searchQuery, selectedCategory, selectedSubcategory])

  // Memoized top rated products
  const topRatedProducts = useMemo(() => {
    return products
      .filter((product) => product.averageRating >= 4.0 && product.totalReviews >= 5)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 8)
  }, [products])

  // Category change handlers
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null) // Reset subcategory when category changes
  }, [])

  const handleSubcategoryChange = useCallback((subcategory: string | null) => {
    setSelectedSubcategory(subcategory)
  }, [])

  
  if (loading || reduxLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loading message="Loading products..." size="lg" />
      </div>
    )
  }

  
  if (error || reduxError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Products
            </h2>
            <p className="text-gray-600 mb-4">{error || reduxError}</p>
            <Button onClick={fetchData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter - Now on top */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedCategory={handleCategoryChange}
          setSelectedSubcategory={handleSubcategoryChange}
        />
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-gray-600">
              Found {filteredProducts.length} product(s)
            </p>
          </div>
        )}

        {/* Top Rated Products Section */}
        {!searchQuery && selectedCategory === 'all' && topRatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Top Rated Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topRatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  averageRating={product.averageRating}
                  totalReviews={product.totalReviews}
                  userId={currentUser}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {!searchQuery && selectedCategory === 'all' && currentUser && (
          <RecommendationsSection
            recommendations={recommendations}
            loading={recommendationsLoading}
            userId={currentUser}
          />
        )}

        {/* Top Rated Products for Non-Logged Users */}
        {!searchQuery && selectedCategory === 'all' && !currentUser && topRatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Top Rated Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topRatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  averageRating={product.averageRating}
                  totalReviews={product.totalReviews}
                  userId={currentUser}
                />
              ))}
            </div>
          </div>
        )}



        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {searchQuery
              ? 'Search Results'
              : selectedCategory !== 'all'
              ? `${selectedCategory} Products`
              : 'All Products'}
          </h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'No products available in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  averageRating={product.averageRating}
                  totalReviews={product.totalReviews}
                  userId={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
