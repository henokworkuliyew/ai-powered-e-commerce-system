import dbConnect from '@/lib/dbConnect'
import  User  from '@/server/models/User'
import bcrypt from 'bcryptjs'


export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function findUserByEmail(email: string) {
  await dbConnect()
  return await User.findOne({
    email: email.toLowerCase(),
    $or: [
      { role: { $ne: 'CARRIER' } }, 
      { role: 'CARRIER', isActive: true }, 
    ],
  }).select('+hashedPassword')
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: 'USER' | 'ADMIN' | 'MANAGER' | 'CARRIER'
  warehouse?: string
}) {
  await dbConnect()

  const hashedPassword = await hashPassword(userData.password)

  const user = new User({
    name: userData.name,
    email: userData.email.toLowerCase(),
    hashedPassword,
    role: userData.role || 'USER',
    isActive: userData.role === 'CARRIER' ? false : true, 
    warehouse: userData.warehouse,
    activatedAt: userData.role !== 'CARRIER' ? new Date() : undefined,
  })

  return await user.save()
}

export async function updateUserPassword(userId: string, newPassword: string) {
  await dbConnect()

  const hashedPassword = await hashPassword(newPassword)

  return await User.findByIdAndUpdate(
    userId,
    {
      hashedPassword,
      updatedAt: new Date(),
    },
    { new: true }
  )
}
