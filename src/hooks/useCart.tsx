'use client'
import { CartProduct } from '@/type/CartProduct'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'



type CartContextType = {
  cartTotalQty: number
  cartProducts: CartProduct[]
  handleAddProductToCart: (product: CartProduct) => void
  handleRemoveProductFromCart: (productId: string) => void
  handleUpdateQuantity: (productId: string, qty: number) => void
  clearCart: ()=>void
}

export const CartContext = createContext<CartContextType | null>(null)

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const storedCart = localStorage.getItem('cart')
      return storedCart ? JSON.parse(storedCart) : []
    } catch {
      return []
    }
  })

  const [cartTotalQty, setCartTotalQty] = useState(0)

  useEffect(() => {
    if (cartProducts.length > 0) {
      setCartTotalQty(cartProducts.reduce((total, item) => total + item.qty, 0))
    }
  }, [cartProducts])

  useEffect(() => {
  const storedCart = JSON.stringify(cartProducts)
  if (storedCart !== localStorage.getItem('cart')) {
    localStorage.setItem('cart', storedCart)
  }
}, [cartProducts])



  const handleAddProductToCart = useCallback((product: CartProduct) => {
    setCartProducts((prev) => {
      const existItem = prev.find((p) => p.id === product.id)
      if (existItem) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + product.qty } : p
        )
      } else {
        return [...prev, product]
      }
    })
    toast.success('Product added to cart!')
  }, [])
console.log('Cart products:', cartProducts)
console.log('Stringified:', JSON.stringify(cartProducts))

  const handleRemoveProductFromCart = useCallback((productId: string) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== productId))
    toast.success('Product removed from cart!')
  }, [])

  const handleUpdateQuantity = useCallback((productId: string, qty: number) => {
    setCartProducts((prev) => {
      return prev.map((p) =>
        p.id === productId && p.qty !== qty ? { ...p, qty } : p
      )
    })
    
  }, [])

const clearCart = useCallback(() => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to clear the cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, clear it!',
  }).then((result) => {
    if (result.isConfirmed) {
      setCartProducts([])
      toast.success('The whole cart has been cleared.')
    }
  })
}, [])



  return (
    <CartContext.Provider
      value={{
        cartTotalQty,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleUpdateQuantity,
        clearCart
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
