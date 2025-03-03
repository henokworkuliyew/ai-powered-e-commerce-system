import { IUser } from "@/server/models/User"


export type SafeUser = Omit<IUser, 
'createdAt' | 'updatedAt' | 'emailVerified'> & {
    createdAt: string
    updatedAt: string 
    emailVerified: string | null
}