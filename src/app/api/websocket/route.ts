// src/app/api/websocket/route.ts
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/action/CurrentUser'

export async function GET() {
  try {
    const CurrentUser = await getCurrentUser()
    if (!CurrentUser) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000'
    const url = `${wsUrl}/api/notifications?userId=${CurrentUser._id}`

    return NextResponse.json({
      url,
      userId: CurrentUser._id,
      role: CurrentUser.role,
    })
  } catch (error) {
    console.error('[WEBSOCKET_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
