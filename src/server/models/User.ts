import mongoose, { Document, Schema } from 'mongoose'


interface CurrentShipment {
  shipmentId: string
  trackingNumber: string
  orderNumber: string
  estimatedDelivery: string
}

export interface IUser extends Document {
  name: string
  email: string
  hashedPassword?: string
  emailVerified?: Date
  image?: string
  createdAt: Date
  updatedAt: Date
  role: 'USER' | 'ADMIN' | 'MANAGER' | 'CARRIER'
}


export interface ICarrier extends IUser {
  isActive: boolean
  contactPhone?: string
  vehicle?: string
  zone?: string
  activatedAt?: string
  currentShipment?: CurrentShipment
}


const userSchema = new Schema<IUser | ICarrier>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: false },
  emailVerified: { type: Date },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['USER', 'ADMIN', 'MANAGER', 'CARRIER'],
    default: 'USER',
  },
 
  isActive: { type: Boolean, default: false },
  contactPhone: { type: String },

  vehicle: { type: String },
  zone: { type: String },
  activatedAt: { type: String },
  currentShipment: {
    shipmentId: mongoose.Types.ObjectId,
    trackingNumber: { type: String },
    orderNumber: { type: String },
    estimatedDelivery: { type: String },
  },
})


const User =  mongoose.models.User || mongoose.model<IUser | ICarrier>('User', userSchema)

export default User
