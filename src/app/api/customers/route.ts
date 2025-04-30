import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import Address from '@/server/models/Address'
import User from '@/server/models/User'
import { NextResponse } from 'next/server'


export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = Number.parseInt(searchParams.get('limit') || '50')

    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const users = await User.find(query).limit(limit).lean()

    const customersWithAddresses = await Promise.all(
      users.map(async (user: any) => {
        const addresses = await Address.find({ userId: user._id }).lean()
        return {
          ...user,
          _id: user._id.toString(),
          addresses: addresses.map((addr: any) => ({
            ...addr,
            _id: addr._id.toString(),
          })),
        }
      })
    )

    return NextResponse.json({ customers: customersWithAddresses })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching customers:', error.message)
       return NextResponse.json(
         { error: 'Failed to fetch customers' },
         { status: 500 }
       )
    }
    else {      
        console.error('Error fetching customers:', error)

        }

   
  }
}
