import { type NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'


export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { password } = await request.json()
    const { token } = params

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    console.log('Received Token: ', token)

    // Connect to MongoDB
    await dbConnect()

    // Hash the token and compare it with the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    console.log('Hashed Token: ', hashedToken)

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }, // Token not expired
      isActive: { $ne: false }, // Only active users
    })

    if (!user) {
      return NextResponse.json(
        {
          message:
            'Invalid or expired reset token. Please request a new password reset.',
          success: false,
        },
        { status: 400 }
      )
    }

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update user password and clear reset fields
    await User.findByIdAndUpdate(user._id, {
      hashedPassword: hashedPassword,
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpire: 1,
      },
      updatedAt: new Date(),
    })

    console.log(`Password successfully reset for user: ${user.email}`)

    return NextResponse.json(
      {
        message:
          'Password has been reset successfully. You can now login with your new password.',
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      {
        message:
          'An error occurred while resetting your password. Please try again.',
        success: false,
      },
      { status: 500 }
    )
  }
}
