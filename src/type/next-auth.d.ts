import  {  DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}
