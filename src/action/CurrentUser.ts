import { getServerSession } from 'next-auth'

import User from '@/server/models/User'
import dbConnect from '@/lib/dbConnect'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getSession = async () => {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    await dbConnect()
    const currentUser = await User.findOne({ email: session.user.email })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser.toObject(),
      _id: currentUser._id.toString(),
      updatedAt: currentUser.updatedAt?.toISOString() || null,
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if user is authenticated and has required role
export async function requireAuth(
  req: Request,
  roles?: ('USER' | 'ADMIN' | 'MANAGER')[]
) {
  const session = await getSession()

  if (!session?.user) {
    return {
      success: false,
      message: 'Authentication required',
      status: 401,
    }
  }

  if (roles && roles.length > 0) {
    const user = await getCurrentUser()

    if (!user || !roles.includes(user.role)) {
      return {
        success: false,
        message: 'Insufficient permissions',
        status: 403,
      }
    }
  }

  return { success: true, user: session.user }
}

// Helper to check if session is expired
export function isSessionExpired(session: any) {
  if (!session || !session.expires) return true

  const expiryDate = new Date(session.expires)
  return expiryDate < new Date()
}
