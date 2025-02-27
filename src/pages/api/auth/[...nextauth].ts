import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User' 

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        
        await dbConnect()
       console.log('Credentials:', credentials)

        if (!credentials?.email || !credentials?.password) {
           
          throw new Error('Invalid email or password!')
        }

        
        const user = await User.findOne({ email: credentials.email })
        console.log('Incorrect password!')
        if (!user || !user.hashedPassword) {
          throw new Error('Invalid email or password!')
        }

      
           
        const isPasswordValid = await bcrypt.compare(
          
          credentials.password,
          user.hashedPassword
        )
console.log('Is password valid:', isPasswordValid)
        if (!isPasswordValid) {
          throw new Error('Invalid email or password!')
        }

        
        return user
      },
    }),
  ],
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
})
