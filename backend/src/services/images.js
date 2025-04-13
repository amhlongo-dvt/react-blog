import { Image } from '../db/models/image'

export async function createImage(userId, { name, type, data, alt }) {
  const newImage = new Image({
    name: name || 'Untitled',
    type,
    data,
    alt: alt || '',
    uploader: userId,
  })

  return await newImage.save()
}
