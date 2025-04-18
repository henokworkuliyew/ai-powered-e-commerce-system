'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button2'
import ShippingAddressForm from './CheckoutForm'

type PaymentData = {
  checkoutUrl: string
  tx_ref: string
  order: { _id: string; amount: number }
}

const Checkout = () => {
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
      console.log('Payment Data:', data)
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

  const handleSelectChange = (name: string, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }))
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
            onSelectChange={handleSelectChange}
          />

          <Button
            className="w-full bg-yellow-500"
           
            disabled={loading}
            type="submit"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
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

export default Checkout
