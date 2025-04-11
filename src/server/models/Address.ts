import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Addresss =
  mongoose.models.Address || mongoose.model('Address', AddressSchema)
