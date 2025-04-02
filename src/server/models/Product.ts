import mongoose, { Schema, model, models, Document, Types } from 'mongoose'


const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: [{ type: String }],
    icon: { type: String },
  },
  { timestamps: true }
)

export default models.Category || model('Category', CategorySchema)


export interface IProduct extends Document {
  name: string
  description: string
  category: Types.ObjectId
  brand: string
  image: {
    color: string
    colorCode: string
    images: string[]
  }
  inStock: boolean
  quantity: number
  price: number
  review: Types.ObjectId[]
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true, trim: true },
  image: {
    color: { type: String, required: true, trim: true },
    colorCode: { type: String, required: true, trim: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Images array must contain at least one image.',
      },
    },
  },
  inStock: { type: Boolean, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  review: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
})
export const Product = mongoose.model<IProduct>('Product', ProductSchema)