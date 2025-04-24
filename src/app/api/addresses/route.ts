import { type NextRequest, NextResponse } from 'next/server'
import Address, { IAddress } from '@/server/models/Address'
import connectDB from '@/lib/dbConnect'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const addresses = await Address.find({ userId }).lean()

    // Format the addresses for response
    const formattedAddresses = addresses.map((address:  any) => ({
      ...address,
      _id: address._id.toString(),
      userId: address.userId.toString(),
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedAddresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
    console.log('POST request to /api/adresses')
  try {
    await connectDB()

    const body = await request.json()
    const { shipping, billing } = body

    // Create shipping address
    const shippingAddress = await Address.create({
      ...shipping,
      userId: shipping.userId || '65f5e1f8b74c8b9d1c8b4567', // Mock user ID if not provided
      isDefault: true,
    })

    // Create billing address if different from shipping
    let billingAddress
    if (billing) {
      billingAddress = await Address.create({
        ...billing,
        userId: billing.userId || '65f5e1f8b74c8b9d1c8b4567', // Mock user ID if not provided
        isDefault: false,
      })
    } else {
      billingAddress = shippingAddress
    }

    return NextResponse.json(
      {
        shippingAddressId: shippingAddress._id,
        billingAddressId: billingAddress._id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating addresses:', error)
    return NextResponse.json(
      { error: 'Failed to create addresses' },
      { status: 500 }
    )
  }
}
