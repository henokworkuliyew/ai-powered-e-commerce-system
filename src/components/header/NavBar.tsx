'use client'

import { useRouter } from 'next/navigation'
import { FaSearch, FaShoppingCart, FaBell } from 'react-icons/fa'

import Heading from '../ui/Heading'

import { useCart } from '@/hooks/useCart'
import { useState, useEffect } from 'react'
import UserMenu from './UserMenu'
import { SafeUser } from '@/type/SafeUser'

interface HeaderProps {
  currentUser: SafeUser | null
}
const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const router = useRouter()
  const { cartProducts } = useCart()
  const [cartCount, setCartCount] = useState(0)


  useEffect(() => {
    const totalQty = cartProducts?.reduce((acc, item) => acc + item.qty, 0) || 0
    setCartCount(totalQty)
  }, [cartProducts])

  const handleClick = () => {
    router.push('/')
  }

  return (
    <header className="bg-slate-300 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 shadow-md">
      <button onClick={handleClick}>
        <Heading text="Gulit" gradient level={4} />
      </button>

      <div className="flex items-center bg-white px-2 py-1 rounded-md shadow-md w-40 sm:w-80">
        <input
          type="text"
          placeholder="Search"
          className="outline-none px-2 py-1 w-full"
        />
        <button className="text-gray-600">
          <FaSearch />
        </button>
      </div>

      <div className="flex space-x-4 flex-shrink-0 justify-between">
        <button onClick={() => router.push('/cart')} className="relative">
          <FaShoppingCart className="text-2xl text-lime-600" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 py-0.5">
              {cartCount}
            </span>
          )}
        </button>

        <button>
          <FaBell className="text-2xl text-blue-500" />
        </button>

        <UserMenu currentUser={currentUser} />
      </div>
    </header>
  )
}

export default Header
