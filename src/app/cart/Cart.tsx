'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { CartProduct } from '@/type/CartProduct'

// Define the Cart Context Type
type CartContextType = {
  cartTotalQty: number
  cartProducts: CartProduct[]
  handleAddProductToCart: (product: CartProduct) => void
  handleRemoveProductFromCart: (productId: string) => void
  handleUpdateQuantity: (productId: string, qty: number) => void
}

// Ensure CartContext is not null by providing an initial empty object
export const CartContext = createContext<CartContextType | null>(null)

export const CartContextProvider = ({ children }: { children: ReactNode }) => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart')
      return storedCart ? JSON.parse(storedCart) : []
    }
    return []
  })

  const [cartTotalQty, setCartTotalQty] = useState(0)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts))
    setCartTotalQty(cartProducts.reduce((total, item) => total + item.qty, 0))
  }, [cartProducts])

  const handleAddProductToCart = useCallback((product: CartProduct) => {
    setCartProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id)
      if (existingProduct) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        )
      } else {
        return [...prev, { ...product, qty: 1 }]
      }
    })
  }, [])

  const handleRemoveProductFromCart = useCallback((productId: string) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== productId))
  }, [])

  const handleUpdateQuantity = useCallback((productId: string, qty: number) => {
    setCartProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, qty } : p))
    )
  }, [])

  // ✅ Provide a valid `value` prop to CartContext.Provider
  const contextValue: CartContextType = {
    cartTotalQty,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleUpdateQuantity,
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  )
}

// Custom Hook to use Cart Context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider')
  }
  return context
}
