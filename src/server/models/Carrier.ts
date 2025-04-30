import mongoose, { Schema, type Document } from 'mongoose'

export interface ICarrier extends Document {
  name: string
  trackingUrlTemplate: string
  logo?: string
  contactPhone?: string
  contactEmail?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CarrierSchema = new Schema<ICarrier>(
  {
    name: { type: String, required: true, unique: true },
    trackingUrlTemplate: { type: String, required: true },
    logo: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Carrier ||
  mongoose.model<ICarrier>('Carrier', CarrierSchema)
