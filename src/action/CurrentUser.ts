import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import User from '@/server/models/User'

export const getSession = async () => {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

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
