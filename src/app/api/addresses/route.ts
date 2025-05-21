import { type NextRequest, NextResponse } from 'next/server'
import Address from '@/server/models/Address'
import connectDB from '@/lib/dbConnect'


type AddressResponse = {
  _id: string
  userId: string
  fullName: string
  email?: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

type AddressDocument = {
  _id: string 
  userId: string
  fullName: string
  email?: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  __v: number 
}

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

    const addresses = await Address.find({ userId }).lean<AddressDocument[]>()

    const formattedAddresses: AddressResponse[] = addresses.map((address) => ({
      ...address,
      _id: address._id.toString(), // Convert ObjectId to string
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
