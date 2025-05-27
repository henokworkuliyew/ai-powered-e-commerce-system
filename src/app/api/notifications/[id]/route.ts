import { type NextRequest, NextResponse } from 'next/server'

const notifications: any[] = []

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = Number.parseInt(params.id)
    const body = await request.json()
    const { read } = body

    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId
    )

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      read: read !== undefined ? read : notifications[notificationIndex].read,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      notification: notifications[notificationIndex],
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = Number.parseInt(params.id)
    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId
    )

    if (notificationIndex === -1) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    notifications.splice(notificationIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
