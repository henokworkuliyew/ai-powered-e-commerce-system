'use client'

import React, { useEffect, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { ShoppingCart, X, ArrowLeft, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SetQuantity from '@/components/ProductCard/SetQuantity'
import Button from '@/components/UI/Button'

function Cart() {
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleUpdateQuantity,
    clearCart,
  } = useCart()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="text-center relative">
        <div className="relative w-16 h-16 mx-auto">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
          <X className="w-8 h-8 text-red-500 absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white rounded-full" />
        </div>
        <p className="text-lg mt-2">Your cart is empty.</p>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price * product.qty,
    0
  )

  const discountRate = 10
  const discount = (discountRate / 100) * subtotal
  const taxRate = 8
  const tax = (taxRate / 100) * subtotal
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal - discount + tax + shipping

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-6 rounded-lg shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 flex items-center space-x-3 mt-8">
                    <div
                      onClick={() => router.push(`/product/${product.id}`)}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer"
                    >
                      <Image
                        src={product.selectedImg.image}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <span>{product.name}</span>
                  </td>
                  <td className="px-4 py-2 text-center pt-8">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center pt-8">
                    <SetQuantity
                      cartProduct={product}
                      handleQtyDecrease={() => {
                        if (product.qty > 1) {
                          handleUpdateQuantity(product.id, product.qty - 1)
                        }
                      }}
                      handleQtyIncrease={() => {
                        if (product.qty < 50) {
                          handleUpdateQuantity(product.id, product.qty + 1)
                        }
                      }}
                      showLabel={false}
                    />
                  </td>
                  <td className="px-4 py-2 text-center font-semibold pt-8">
                    ${(product.price * product.qty).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center pt-8">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveProductFromCart(product.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="max-w-52 p-10">
            <Button
              label="
            Clear Cart"
              onClick={() => {
                clearCart()
              }}
              size="small"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg shadow bg-white">
        <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
        <div className="space-y-2">
          <p className="flex justify-between">
            <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Discount ({discountRate}%):</span>{' '}
            <span>-${discount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Taxes ({taxRate}%):</span> <span>${tax.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Estimated Shipping:</span> <span>${shipping.toFixed(2)}</span>
          </p>
          <hr />
          <p className="flex justify-between font-bold text-lg">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
          </p>
        </div>
        <div className="max-w-[400px] flex flex-row gap-6 mt-5">
          <Button
            label="Proceed to Checkout"
            onClick={() => router.push('/register')}
            outline
          />
        </div>
        <Link
          href="/"
          className="text-blue-500 hover:underline mt-4 inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Cart
