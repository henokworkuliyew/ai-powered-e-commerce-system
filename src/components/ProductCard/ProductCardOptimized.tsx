'use client'

import React, { useState, useCallback, memo } from 'react'
import type { Product } from '@/type/Product'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { truncateText } from '@/hooks/utils/truncateText'
import { Rating } from '@mui/material'
import { FormatPrice } from '@/hooks/utils/formatPrice'
import WishlistButton from './WishlistButton'
import { useReduxCart } from '@/hooks/useReduxCart'
import { toast } from 'react-toastify'
import { MdCheckCircle } from 'react-icons/md'

interface ProductCardProps {
  product: Product
  averageRating?: number
  totalReviews?: number
  userId: string | null
}

const ProductCard = memo<ProductCardProps>(({
  product,
  averageRating,
  totalReviews,
  userId,
}) => {
  const router = useRouter()
  const { handleAddProductToCart, cartProducts } = useReduxCart()
  const [isHovered, setIsHovered] = useState(false)

  const isInCart = cartProducts?.some((item) => item._id === product._id)

  const handleQuickAdd = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!userId) {
      toast.error('Please log in to add to cart')
      return
    }

    try {
      const interactionData = {
        user_id: userId,
        item_id: product._id,
        event_type: 'add_to_cart',
        rating: null,
      }

      const response = await fetch(
        'https://rec-system-8mee.onrender.com/interactions/record',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(interactionData),
        }
      )

      if (!response.ok) {
        console.error('Failed to record interaction:', response.statusText)
      } else {
        console.log('Interaction recorded successfully')
      }
    } catch (error) {
      console.error('Error recording interaction:', error)
    }

    const cartProduct = {
      _id: product._id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category.name,
      selectedImg: {
        ...product.images[0],
      },
      qty: 1,
      price: product.price,
    }

    handleAddProductToCart(cartProduct)
    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: <MdCheckCircle className="text-green-500" />,
    })
  }, [userId, product, handleAddProductToCart])

  const handleCardClick = useCallback(async () => {
    if (!userId) {
      console.warn('No user ID available, skipping interaction recording')
      router.push(`/product/${product._id}`)
      return
    }

    try {
      const interactionData = {
        user_id: userId,
        item_id: product._id,
        event_type: 'click',
        rating: null,
      }

      const response = await fetch(
        'https://rec-system-8mee.onrender.com/interactions/record',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(interactionData),
        }
      )

      if (!response.ok) {
        console.error('Failed to record interaction:', response.statusText)
      } else {
        console.log('Interaction recorded successfully')
      }
    } catch (error) {
      console.error('Error recording interaction:', error)
    }

    router.push(`/product/${product._id}`)
  }, [userId, product._id, router])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <div
      className="col-span-1 cursor-pointer rounded-sm p-2 transition hover:shadow-lg text-center text-sm relative group"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden relative w-full h-36">
          <Image
            src={product?.images?.[0]?.views?.front}
            alt={product?.name || 'Product Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`w-full h-36 object-cover rounded-md transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute top-2 right-2">
              <WishlistButton
                productId={product._id || ''}
                size={18}
                className="bg-white p-2 rounded-full"
              />
            </div>

            <button
              onClick={handleQuickAdd}
              className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition"
            >
              {isInCart ? 'Added to Cart' : 'Quick Add'}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <div className="font-medium">
            {truncateText(product?.name || 'No Name Available')}
          </div>

          <div className="mt-1 flex items-center gap-1">
            <Rating
              value={averageRating}
              readOnly
              size="small"
              precision={0.5}
            />
            <span className="text-xs text-gray-500">({totalReviews})</span>
          </div>

          <div className="mt-1 font-bold">{FormatPrice(product?.price)}</div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: img.colorCode || 'gray' }}
                  title={img.color}
                />
              ))}
              {product.images.length > 4 && (
                <div className="text-xs text-gray-500">
                  +{product.images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard


