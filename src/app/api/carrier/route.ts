import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import Carrier from '@/server/models/Carrier'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || !['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    await dbConnect()
    const carriers = await Carrier.find({}).sort({ name: 1 })

    return NextResponse.json({ carriers })
  } catch (error) {
    console.error('Error fetching carriers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch carriers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || !['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    const body = await request.json()

    await dbConnect()
    const newCarrier = await Carrier.create(body)

    return NextResponse.json({ carrier: newCarrier }, { status: 201 })
  } catch (error) {
    console.error('Error creating carrier:', error)
    return NextResponse.json(
      { error: 'Failed to create carrier' },
      { status: 500 }
    )
  }
}
