import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import dbConnect from '@/lib/dbConnect'
import Notification, { NotificationType } from '@/server/models/Notification'

interface NotificationQuery {
  userId: string
  type?: NotificationType 
  read?: boolean
  
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const query: NotificationQuery = { userId: session.user.id }

    if (type) {
    //   query.type = type 
    }

    // Update notifications
    const result = await Notification.updateMany(query, {
      $set: { read: true },
    })

    return NextResponse.json({
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    )
  }
}
