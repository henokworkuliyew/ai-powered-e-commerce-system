'use client'

import { useState, useEffect } from 'react'
import type { User } from '@/type/User'
import ProfileView from '@/components/profile/profile-view'

interface ProfilePageProps {
  currentUser: User | null
}
export default function ProfilePage({ currentUser }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = currentUser?._id

  useEffect(() => {
    let mounted = true

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/register/${userId}`)
        if (response.ok && mounted) {
          const result = await response.json()
          setUser(result.user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUser()
    return () => {
      mounted = false
    }
  }, [userId])

  const handleUpdate = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-medium text-gray-900">User not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your account information
          </p>
        </div>
        <ProfileView user={user} onUpdate={handleUpdate} />
      </div>
    </div>
  )
}
