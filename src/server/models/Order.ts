import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'ETB' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'in transit', 'delivered', 'returned'],
    default: 'pending',
    required: true,
  },
  createDate: { type: Date, default: Date.now },
  paymentIntentId: { type: String, unique: true, required: true },
  products: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      brand: { type: String, required: true },
      selectedImg: {
        color: { type: String, required: true },
        colorCode: { type: String, required: true },
        image: { type: String, required: true },
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  address: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
})

export const Order =
  mongoose.models.Order || mongoose.model('Order', OrderSchema)
