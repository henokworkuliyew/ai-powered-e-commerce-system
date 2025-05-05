import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'

interface CarrierUpdate {
  isActive: boolean
  currentShipment?: null
  activatedAt?: string
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid carrier ID' }, { status: 400 })
    }

    const body = await request.json()

    if (body.activatedAt && typeof body.activatedAt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid activatedAt format, must be a string' },
        { status: 400 }
      )
    }

    const updateData: CarrierUpdate = {
      isActive: true,
    }

    const updateQuery = {
      $set: updateData,
      $unset: { currentShipment: '' },
    }

    if (body.activatedAt) {
      updateData.activatedAt = body.activatedAt
      updateQuery.$set = updateData
    }

    const carrier = await User.findOneAndUpdate(
      { _id: id, role: 'CARRIER' },
      updateQuery,
      { new: true }
    ).select('-hashedPassword')

    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }

    return NextResponse.json({ carrier })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return NextResponse.json(
        { error: 'Invalid carrier ID format' },
        { status: 400 }
      )
    }
    if (error instanceof Error) {
      console.error('Error completing delivery:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    console.error('Error completing delivery:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
