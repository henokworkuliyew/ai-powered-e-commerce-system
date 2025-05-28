import mongoose, { Schema, type Document, model } from 'mongoose'

type CurrentShipment = {
  shipmentId: string
  trackingNumber: string
  orderNumber: string
  estimatedDelivery: string
}

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  hashedPassword?: string
  emailVerified?: Date
  image?: string
  contactPhone?: string
  createdAt: Date
  updatedAt: Date
  role: 'USER' | 'ADMIN' | 'MANAGER' | 'CARRIER'
  isActive?: boolean
  vehicle?: string
  zone?: string
  activatedAt?: Date
  currentShipment?: CurrentShipment
  warehouse?: string
  resetPasswordToken?: string
  resetPasswordExpire?: Date
}

const CurrentShipmentSchema = new Schema(
  {
    shipmentId: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    orderNumber: { type: String, required: true },
    estimatedDelivery: { type: String, required: true },
  },
  { _id: false }
)

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // This implicitly creates an index
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      select: false,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'MANAGER', 'CARRIER'],
      default: 'USER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vehicle: {
      type: String,
      trim: true,
    },
    zone: {
      type: String,
      trim: true,
    },
    activatedAt: {
      type: Date,
    },
    currentShipment: {
      shipmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Shipment',
      },
      trackingNumber: {
        type: String,
      },
      orderNumber: {
        type: String,
      },
      estimatedDelivery: {
        type: String,
      },
    },
    warehouse: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'MANAGER'
      },
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        if (ret.role !== 'CARRIER') {
          delete ret.isActive
          delete ret.vehicle
          delete ret.zone
          delete ret.activatedAt
          delete ret.currentShipment
        }
        if (ret.role !== 'MANAGER') {
          delete ret.warehouse
        }
        delete ret.resetPasswordToken
        delete ret.resetPasswordExpire
        return ret
      },
    },
  }
)

// Add indexes (remove the duplicate email index)
UserSchema.index({ resetPasswordToken: 1 })
UserSchema.index({ resetPasswordExpire: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })


const User = mongoose.models.User || model<IUser>('User', UserSchema)
export default User
