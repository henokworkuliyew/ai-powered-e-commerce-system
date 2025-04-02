'use client'

import Button from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ShippingAddressForm from './CheckoutForm'

type PaymentData = {
  checkoutUrl: string
  tx_ref: string
  order: { _id: string; amount: number }
}

const CheckoutPageForm = () => {
  const { cartProducts } = useCart()
  const [loading, setLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [error, setError] = useState(false)
  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    country: '',
    zipCode: '',
  })

  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }, [checkoutUrl])

  
  const validateForm = () => {
    if (
      !address.name ||
      !address.email ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.country ||
      !address.zipCode
    ) {
      toast.error('Please fill in all required fields.')
      return false
    }
    return true
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault() 

    if (!validateForm()) return

    if (cartProducts.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    setError(false)

    try {
      const response = await fetch('/api/payment/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartProducts, address }),
      })
      const data: PaymentData = await response.json()

      if (data?.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl)
      } else {
        setError(true)
        toast.error('Failed to generate payment link')
      }
    } catch (error) {
      setError(true)
      if (error instanceof Error) {
        console.error('Checkout Error:', error.message)
        toast.error(error.message)
      } else {
        console.error('Unknown error:', error)
        toast.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {!error && (
        <form onSubmit={handleCheckout}>
          <ShippingAddressForm
            address={address}
            onAddressChange={(e) =>
              setAddress((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />

          <Button
            label={loading ? 'Processing...' : 'Proceed to Payment'}
            disabled={loading}
            outline
          />
        </form>
      )}
      {error && (
        <div className="text-red-600 mt-2">
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  )
}

export default CheckoutPageForm
