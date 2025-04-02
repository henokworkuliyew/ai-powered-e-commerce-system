import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import bcrypt from 'bcrypt'
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()

  const { name, email, password } = body
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log('The data is:', body)
   
  try {
    const user = new User({ name, email, hashedPassword })
    const savedUser = await user.save()
    console.log('User created:', savedUser)

    return new Response(
      JSON.stringify({ message: 'User created', user: savedUser }),
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating user:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}
