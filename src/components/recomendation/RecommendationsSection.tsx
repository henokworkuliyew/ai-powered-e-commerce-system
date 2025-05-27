'use client'

import { useState } from 'react'
import type { Product } from '@/type/Product'
import { ProductCard } from '@/components/ProductCard/productCard'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface RecommendationsSectionProps {
  recommendations: Product[]
  loading: boolean
  userId: string | null
}

export default function RecommendationsSection({
  recommendations,
  loading,
  userId,
}: RecommendationsSectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scrollLeft = () => {
    const container = document.getElementById('recommendations-container')
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 300)
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById('recommendations-container')
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + 300)
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  if (!loading && recommendations.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Recommended for You
          </h2>
        
        </div>

        {recommendations.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading recommendations...</span>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="relative">
          <div
            id="recommendations-container"
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {recommendations.map((product, index) => (
              <div
                key={product._id || `rec-${index}`}
                className="flex-shrink-0 w-48"
              >
                <div className="relative">
                  {/* Recommendation badge */}
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Recommended</span>
                  </div>
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            No recommendations available at the moment
          </p>
          <p className="text-sm text-gray-500">
            Browse our products to get personalized recommendations
          </p>
        </div>
      )}
    </div>
  )
}
