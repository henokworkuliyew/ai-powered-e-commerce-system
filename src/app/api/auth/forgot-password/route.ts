import { type NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required', success: false },
        { status: 400 }
      )
    }

    
    await dbConnect()

    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: { $ne: false }, 
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 404 }
      )
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Set expiration to 10 minutes
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000)

    // Update user with reset token
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: resetPasswordExpire,
    })

    // Construct reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@yourapp.com',
      to: user.email,
      subject: 'Password Reset Request - E-Commerce Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #1e293b; font-size: 28px; margin-bottom: 8px;">Password Reset Request</h1>
            <p style="color: #64748b; font-size: 16px;">Secure access to your e-commerce account</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
              Hello <strong>${user.name || 'User'}</strong>,
            </p>
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              You have requested to reset your password for your e-commerce account. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(to right, #1e293b, #475569); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Reset Your Password
              </a>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 20px 0;">
              <p style="font-size: 14px; color: #92400e; margin: 0;">
                <strong>Security Notice:</strong> This link will expire in 10 minutes for your security.
              </p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
              If you did not request this password reset, please ignore this email and your password will remain unchanged.
            </p>
            <p style="font-size: 14px; color: #64748b;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="font-size: 12px; color: #64748b; word-break: break-all; background: #f1f5f9; padding: 8px; border-radius: 4px;">
              ${resetUrl}
            </p>
          </div>
          
          <footer style="text-align: center; font-size: 12px; color: #94a3b8; padding-top: 20px; border-top: 1px solid #e2e8f0; margin-top: 20px;">
            <p>© ${new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </footer>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        message: 'Password reset instructions have been sent to your email',
        success: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in forgot password:', error)

    // Clear reset token on error if user was found
    try {
      const { email } = await request.json()
      if (email) {
        await User.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $unset: {
              resetPasswordToken: 1,
              resetPasswordExpire: 1,
            },
          }
        )
      }
    } catch (cleanupError) {
      console.error('Error cleaning up reset token:', cleanupError)
    }

    return NextResponse.json(
      {
        message: 'Unable to send reset email. Please try again later.',
        success: false,
      },
      { status: 500 }
    )
  }
}
