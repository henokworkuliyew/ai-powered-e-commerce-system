'use client'
import { CartProduct } from '@/type/CartProduct'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type CartContextType = {
  cartTotalQty: number
  cartProducts: CartProduct[]
  handleAddProductToCart: (product: CartProduct) => void
  handleRemoveProductFromCart: (product: CartProduct) => void
  handleUpdateQuantity: (product: CartProduct) => void
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [cartProducts, setCartProduct] = useState<CartProduct[]>(() => {
    
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart')
      return storedCart ? JSON.parse(storedCart) : []
    }
    return []
  })

  const [cartTotalQty, setCartTotalQty] = useState(() => {
    return cartProducts.reduce((total, item) => total + item.qty, 0)
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProducts))
    setCartTotalQty(cartProducts.reduce((total, item) => total + item.qty, 0))
  }, [cartProducts])

  const handleAddProductToCart = useCallback((product: CartProduct) => {
    setCartProduct((prev) => {
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
  const handleRemoveProductFromCart =  useCallback((product: CartProduct) => {

  },[]
  )
 const handleUpdateQuantity = useCallback((product: CartProduct) => {}, [])

  return (
    <CartContext.Provider
      value={{
        cartTotalQty,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleUpdateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context)
    throw new Error('useCart must be used within a CartContextProvider')
  return context
}
