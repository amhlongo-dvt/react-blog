import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    tags: [String],
    featuredImage: { type: Schema.Types.ObjectId, ref: 'Image' },
  },
  { timestamps: true },
)

export const Post = mongoose.model('Post', postSchema)
