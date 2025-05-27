import dbConnect from '@/lib/dbConnect'
import User, { type IUser } from '@/server/models/User'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { z } from 'zod'

// Optimized update schemas - all fields optional except where needed
const baseUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  contactPhone: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .optional(),
  image: z.string().url({ message: 'Invalid image URL' }).optional(),
})

const carrierUpdateSchema = baseUpdateSchema.extend({
  isActive: z.boolean().optional(),
  vehicle: z.string().optional(),
  zone: z.string().optional(),
  activatedAt: z
    .string()
    .datetime({ message: 'Invalid activatedAt date' })
    .optional(),
  currentShipment: z
    .object({
      shipmentId: z.string(),
      trackingNumber: z.string(),
      orderNumber: z.string(),
      estimatedDelivery: z.string(),
    })
    .optional(),
})

const managerUpdateSchema = baseUpdateSchema.extend({
  warehouse: z.string().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect()

  try {
    const { id } = await params

    const body = await req.json()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const existingUser = await User.findById(id)
    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (body.email && body.email !== existingUser.email) {
      const emailExists = await User.findOne({ email: body.email })
      if (emailExists) {
        return new Response(JSON.stringify({ error: 'Email already in use' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    let validationResult
    if (existingUser.role === 'CARRIER') {
      validationResult = carrierUpdateSchema.safeParse(body)
    } else if (existingUser.role === 'MANAGER') {
      validationResult = managerUpdateSchema.safeParse(body)
    } else {
      validationResult = baseUpdateSchema.safeParse(body)
    }

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: validationResult.error.format(),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const updateData: Partial<IUser> = {
      updatedAt: new Date(),
    }

    if (body.name) updateData.name = body.name
    if (body.email) updateData.email = body.email
    if (body.contactPhone !== undefined)
      updateData.contactPhone = body.contactPhone
    if (body.image !== undefined) updateData.image = body.image
    if (body.password) {
      updateData.hashedPassword = await bcrypt.hash(body.password, 10)
    }

    if (existingUser.role === 'CARRIER') {
      if (body.isActive !== undefined) updateData.isActive = body.isActive
      if (body.vehicle) updateData.vehicle = body.vehicle
      if (body.zone !== undefined) updateData.zone = body.zone
      if (body.activatedAt) updateData.activatedAt = new Date(body.activatedAt)
      if (body.currentShipment) {
        updateData.currentShipment = {
          ...body.currentShipment,
          shipmentId: new mongoose.Types.ObjectId(
            body.currentShipment.shipmentId
          ),
        }
      }
    } else if (existingUser.role === 'MANAGER') {
      if (body.warehouse) updateData.warehouse = body.warehouse
    }

   
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    }

    return new Response(
      JSON.stringify({
        message: 'Profile updated successfully',
        user: userResponse,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.error('Error updating user:', error)
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect()

  try {
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid user ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const user = await User.findById(id).select('-hashedPassword')

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      ...(user.role === 'CARRIER' && {
        contactPhone: user.contactPhone,
        isActive: user.isActive,
        vehicle: user.vehicle,
        zone: user.zone,
        activatedAt: user.activatedAt,
        currentShipment: user.currentShipment,
      }),
      ...(user.role === 'MANAGER' && {
        warehouse: user.warehouse,
      }),
    }

    return new Response(JSON.stringify({ user: userResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
