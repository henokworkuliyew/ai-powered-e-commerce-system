import { Schema, model, models } from 'mongoose'

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    subCategories: [{ type: String, required: false }],
    icon: { type: String ,required: false },
  },
  { timestamps: true }
)

export default models.Category || model('Category', CategorySchema)