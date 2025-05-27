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

export default function Home({ currentUser }: HomeProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
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
    const fetchRecommendations = async () => {

  
      try {
        setRecommendationsLoading(true)

        const response = await fetch(
          `https://rec-system-8mee.onrender.com/user/recommendations/${currentUser}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.recommendations && Array.isArray(data.recommendations)) {
            setRecommendations(data.recommendations)
          } else if (Array.isArray(data)) {
            setRecommendations(data)
          } else {
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

      if (!product.category || product.category.name !== selectedCategory) {
        return false
      }

      if (selectedSubcategory) {
        if (
          product.category.subCategories &&
          product.category.subCategories.includes(selectedSubcategory)
        ) {
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

      <RecommendationsSection
        recommendations={recommendations}
        loading={recommendationsLoading}
        userId={currentUser }
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

function getCategoryCounts(products: Product[]) {
  const counts: Record<string, number> = { all: products.length }

  products.forEach((product) => {
    const category = product.category.name
    counts[category] = (counts[category] || 0) + 1
  })

  return counts
}
