import mongoose, { Schema } from 'mongoose'
const imageSchema = new Schema(
  {
    name: String,
    type: String,
    data: String,
    alt: String,
    uploader: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  { timestamps: true },
)

export const Image = mongoose.model('Image', imageSchema)
