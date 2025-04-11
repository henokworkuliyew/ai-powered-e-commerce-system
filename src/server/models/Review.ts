
import  { Schema, Document, Types, models, model } from 'mongoose'


export interface IReview extends Document {
  userId: Types.ObjectId
  productId: Types.ObjectId
  rating: number
  comment: string
  createdDate: Date
}

const ReviewSchema = new Schema<IReview>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  createdDate: { type: Date, default: Date.now },
})


export const Review = models.Review || model<IReview>('Review', ReviewSchema)

