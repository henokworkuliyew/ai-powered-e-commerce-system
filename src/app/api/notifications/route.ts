import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import dbConnect from '@/lib/dbConnect'
import Notification, {
  type NotificationMetadata,
} from '@/server/models/Notification'


export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

  
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const read = searchParams.get('read')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const page = Number.parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

   
    const query: Record<string, unknown> = { userId: session.user.id }

    if (type) {
      query.type = type
    }

    if (read !== null) {
      query.read = read === 'true'
    }

   
    const total = await Notification.countDocuments(query)

   
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

   
    const unreadCount = await Notification.countDocuments({
      userId: session.user.id,
      read: false,
    })

    return NextResponse.json({
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}


interface CreateNotificationRequest {
  userId?: string
  type: string
  title: string
  description: string
  read?: boolean
  actionUrl?: string
  actionText?: string
  image?: string
  relatedId?: string
  metadata?: NotificationMetadata
  expiresAt?: string
}


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

   
    const isAdmin = session.user.role === 'ADMIN'

    await dbConnect()

    const body: CreateNotificationRequest = await request.json()

    if (!body.title || !body.description || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.userId && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to create notifications for other users' },
        { status: 403 }
      )
    }

    const notification = await Notification.create({
      userId: body.userId || session.user.id,
      type: body.type,
      title: body.title,
      description: body.description,
      read: body.read || false,
      actionUrl: body.actionUrl,
      actionText: body.actionText,
      image: body.image,
      relatedId: body.relatedId,
      metadata: body.metadata,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications - Delete all notifications for the current user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id }

    if (type) {
      query.type = type
    }

    // Delete notifications
    const result = await Notification.deleteMany(query)

    return NextResponse.json({
      message: `Deleted ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    )
  }
}
