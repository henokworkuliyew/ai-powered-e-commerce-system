'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi'
import Image from 'next/image'
import { SafeUser } from '@/type/SafeUser'

interface UserMenuProps {
    currentUser : SafeUser | null
}
const UserMenu:React.FC<UserMenuProps> = ({currentUser}) => {


  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuClick = (path: string) => {
    setIsOpen(false) 
    router.push(path) 
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 rounded-full border hover:bg-gray-100 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={'/_DSC0319.JPG'}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
          priority
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden border z-50">
          {currentUser ? (
            <div>
              <button
                onClick={() => handleMenuClick('/profile')}
                className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <FiUser className="mr-2" /> Profile
              </button>
              <button
                onClick={() => handleMenuClick('/orders')}
                className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <FiShoppingBag className="mr-2" /> My Orders
              </button>
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>{' '}
            </div>
          ) : (

            <div>
              <button
                onClick={() => {
                  handleMenuClick('/login')
                  setIsOpen(false)
                }}
                className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                <FiLogOut className="mr-2" /> Login
              </button>
              <button
                onClick={() => {
                  handleMenuClick('/register')
                  setIsOpen(false)
                }}
                className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 transition"
              >
                <FiLogOut className="mr-2" /> Register
              </button>
            </div>

          )}
        </div>
      )}
    </div>
  )
}

export default UserMenu
