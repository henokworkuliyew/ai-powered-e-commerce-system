import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import { getCurrentUser } from '@/action/CurrentUser'

export async function GET(req: NextRequest) {
  try {
    
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await dbConnect()
    const searchParams = req.nextUrl.searchParams
    console.log('searchParams', searchParams)
    const managers = await User.find(
      { role: 'MANAGER' },
      '_id name email createdAt contactPhone'
    ).sort({
      createdAt: -1,
    })

    return NextResponse.json({
      success: true,
      managers,
    })
  } catch (error) {
    console.error('Error fetching managers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch managers' },
      { status: 500 }
    )
  }
}
