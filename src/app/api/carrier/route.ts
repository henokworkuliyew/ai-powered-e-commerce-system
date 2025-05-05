import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const zone = searchParams.get('zone') || ''
    const status = searchParams.get('status') // "active", "inactive", or undefined for all
    const sort = searchParams.get('sort') || 'name:asc' // Default sort by name ascending
    const limit = Number.parseInt(searchParams.get('limit') || '100') // Default limit to 100 carriers
    const page = Number.parseInt(searchParams.get('page') || '1') // Default to first page

    // Build query
    const query: Record<string, any> = { role: 'CARRIER' }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPhone: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
      ]
    }

    // Add zone filter if provided
    if (zone) {
      query.zone = zone
    }

    // Add status filter if provided
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':')
    const sortOptions: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'desc' ? -1 : 1,
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query
    const carriers = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-hashedPassword') // Exclude sensitive data

    // Get total count for pagination
    const totalCount = await User.countDocuments(query)

    // Format carriers to match the expected Carrier type
    const formattedCarriers = carriers.map((carrier) => ({
      _id: carrier._id.toString(),
      name: carrier.name,
      contactPhone: carrier.contactPhone,
      contactEmail: carrier.contactEmail || carrier.email,
      vehicle: carrier.vehicle,
      zone: carrier.zone,
      isActive: carrier.isActive || false,
      activatedAt: carrier.activatedAt,
      currentShipment: carrier.currentShipment,
      // Add any other fields needed by the frontend
    }))

    return NextResponse.json({
      carriers: formattedCarriers,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching carriers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Carrier name is required' },
        { status: 400 }
      )
    }

    // Create a new carrier (without authentication - for direct admin creation)
    const carrier = new User({
      name: body.name,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      email: body.contactEmail, // Use contactEmail as the email if no separate email is provided
      vehicle: body.vehicle,
      zone: body.zone,
      isActive: body.isActive || false,
      role: 'CARRIER',
      // Set activatedAt if carrier is active
      ...(body.isActive ? { activatedAt: new Date().toISOString() } : {}),
    })

    await carrier.save()

    // Remove sensitive data before returning
    const carrierToReturn = {
      _id: carrier._id,
      name: carrier.name,
      contactPhone: carrier.contactPhone,
      contactEmail: carrier.contactEmail,
      vehicle: carrier.vehicle,
      zone: carrier.zone,
      isActive: carrier.isActive,
      activatedAt: carrier.activatedAt,
    }

    return NextResponse.json({ carrier: carrierToReturn }, { status: 201 })
  } catch (error) {
    console.error('Error creating carrier:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
