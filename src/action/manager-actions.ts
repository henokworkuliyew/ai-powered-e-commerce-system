'use server'

import { revalidatePath } from 'next/cache'
import { hash } from 'bcrypt'
import { z } from 'zod'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import { getCurrentUser } from './CurrentUser'

const managerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  contactPhone: z.string().optional(),
})

export async function addManager(data: z.infer<typeof managerSchema>) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized. Only admins can add managers.',
      }
    }

    // Validate input data
    const validatedData = managerSchema.parse(data)

    // Connect to database
    await dbConnect()

    // Check if email already exists
    const existingUser = await User.findOne({ email: validatedData.email })

    if (existingUser) {
      return {
        success: false,
        error: 'A user with this email already exists.',
      }
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create new manager
    const newManager = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      hashedPassword,
      role: 'MANAGER',
      contactPhone: validatedData.contactPhone,
      emailVerified: new Date(),
    })

    // Revalidate the managers page
    revalidatePath('/admin/managers')

    return {
      success: true,
      managerId: newManager._id.toString(),
    }
  } catch (error) {
    console.error('Error adding manager:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid input data. Please check your form.',
      }
    }

    return {
      success: false,
      error: 'Failed to add manager. Please try again.',
    }
  }
}
