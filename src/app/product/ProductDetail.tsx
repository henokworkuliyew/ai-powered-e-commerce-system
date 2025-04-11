'use client'
import { MdCheckCircle } from 'react-icons/md'
import React, { useCallback, useEffect, useState } from 'react'
import { Product } from '@/type/Product'
import ProductImage from '@/components/ProductCard/ProductImage'
import { Rating } from '@mui/material'
import Button from '@/components/ui/Button'
import { CartProduct, SelectedImg } from '@/type/CartProduct'
import SetQuantity from '@/components/ProductCard/SetQuantity'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import ReviewForm from '@/components/review/ReveiwForm'

interface ProductDetailsProps {
  product: Product
}

const ProductDetail: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter()
  const [cartProduct, setCartProduct] = useState<CartProduct>({

    id: product._id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    category: {
      name: product.category?.name,
      subCategories: product.category?.subCategories,
    },
    selectedImg: {
    ...product.images[0], 
  },
    
    qty: 1,
    price: product.price,
  })
  const handleColorSelect = useCallback(
    (value: SelectedImg) => {
      setCartProduct((prev: CartProduct) => ({ ...prev, selectedImg: value }))
    },
    [cartProduct.selectedImg]
  )
  const { handleAddProductToCart, cartProducts } = useCart()
  const [isProductInCart, setProductIncart] = useState(false)

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.qty === 50) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty + 1,
      }
    })
  }, [cartProduct])
  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.qty === 1) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty - 1,
      }
    })
  }, [cartProduct])
  useEffect(() => {
    setProductIncart(false)
    if (cartProducts) {

      const existItem = cartProducts.find((item) => item.id === product._id)

      if (existItem) {
        setProductIncart(true)
        setCartProduct((prev) => ({
          ...prev,
          qty: existItem.qty,
        }))
      }
    }
  }, [cartProducts, product])

  const handleAddToCart = () => {
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
  }
  const Horizontal = () => {
    return <hr className="border-t-4  w-1/2 mb-5 mt-2" />
  }
  return (
    <div className="flex flex-col mr-5">
      <div className="grid grid-cols-1 md:grid-cols-2 md:w-full gap-10 ">
        <ProductImage
          cartProduct={cartProduct}
          product={product}
          handleColorSelect={handleColorSelect}
        />
        <div className="flex flex-col gap-1 w-full mb-10 p-5">
          <h2 className="text-3xl font-medium text-stone-900">
            {product?.name || 'No Name Available'}
          </h2>

          <div className="text-justify">{product.description}</div>
          <Horizontal />
          <span className="font-semibold">Customer Reveiw:</span>
          <div className="flex flex-row gap-3 ml-10">
            <Rating value={product.rating} readOnly />

            <div>({} reviews)</div>

          </div>
          <Horizontal />
          <div>
            <span className="font-semibold">Category:</span>

            {product.category.name}

          </div>
          <div>
            <span className="font-semibold">Brand:</span>
            {product.brand}
          </div>
          <div className={product.inStock ? 'text-teal-400' : 'text-red-500'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </div>
          {isProductInCart ? (
            <>
              <p className="flex flex-row gap-2 m-3">
                <MdCheckCircle size={15} className="text-lime-600" />
                <span>product added to Cart</span>
              </p>
              <div className="max-w-[400px] flex flex-row gap-6">
                <Button
                  label="Goto Cart"
                  onClick={() => router.push('/cart')}
                />
              </div>
            </>
          ) : (
            <>
              {/* <SetColor
         images={product.images} // Use the correct array of images
         cartProduct={cartProduct}
         handleColorSelect={handleColorSelect}
       /> */}
              <Horizontal />
              <SetQuantity
                cartProduct={cartProduct}
                handleQtyDecrease={handleQtyDecrease}
                handleQtyIncrease={handleQtyIncrease}
              />
              <Horizontal />
              <div className="max-w-[400px] flex flex-row gap-6">
                <Button label="Add to Cart" onClick={handleAddToCart} outline />

                <Button label="Buy Now" onClick={() => {}} outline />
              </div>
            </>
          )}
        </div>
      </div>
      <ul className="list-none p-0">
        <li className="font-semibold p-8">What People are saying:</li>
        <li className="ml-11">
          <div className="flex flex-row">
            <span>User comments ...</span>
            <div className="flex flex-col ml-4">
              <span className="font-semibold">Your comments</span>

              <ReviewForm productId={cartProduct.id} />

            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default ProductDetail
