import { Image } from '../db/models/image.js'

/**
 * Creates a new image document in the database
 * @param {ObjectId} userId - The ID of the user uploading the image
 * @param {Object} imageData - The image data
 * @param {string} [imageData.name] - The name of the image (defaults to 'Untitled')
 * @param {string} imageData.type - The MIME type of the image (required)
 * @param {string} imageData.data - The base64-encoded image data (required)
 * @param {string} [imageData.alt] - Alt text for the image (defaults to empty string)
 * @returns {Promise<Object>} The created image document
 */
export async function createImage(userId, { name, type, data, alt }) {
  if (!userId) {
    throw new Error('User ID is required')
  }

  if (!type) {
    throw new Error('Image type is required')
  }

  if (!data) {
    throw new Error('Image data is required')
  }

  // Truncate alt text if it's too long (e.g., 255 characters max)
  const truncatedAlt = alt ? alt.substring(0, 255) : ''

  const image = new Image({
    name: name || 'Untitled',
    type,
    data,
    alt: truncatedAlt || '',
    uploader: userId,
  })

  return await image.save()
}

/**
 * Retrieves an image by its ID
 * @param {ObjectId|string} imageId - The ID of the image to retrieve
 * @returns {Promise<Object|null>} The image document or null if not found
 */
export async function getImageById(imageId) {
  return await Image.findById(imageId)
}

/**
 * Lists all images uploaded by a specific user
 * @param {ObjectId|string} userId - The ID of the uploader
 * @returns {Promise<Array>} Array of image documents
 */
export async function listImagesByUploader(userId) {
  return await Image.find({ uploader: userId })
}

/**
 * Updates an image's metadata (name and alt text only)
 * @param {ObjectId|string} userId - The ID of the user making the update
 * @param {ObjectId|string} imageId - The ID of the image to update
 * @param {Object} updates - The fields to update
 * @param {string} [updates.name] - The new name for the image
 * @param {string} [updates.alt] - The new alt text for the image
 * @returns {Promise<Object|null>} The updated image or null if not found/not authorized
 */
export async function updateImage(userId, imageId, { name, alt }) {
  // Only allow updating name and alt text
  const updates = {}
  if (name !== undefined) updates.name = name
  if (alt !== undefined) updates.alt = alt

  return await Image.findOneAndUpdate(
    { _id: imageId, uploader: userId },
    { $set: updates },
    { new: true },
  )
}

/**
 * Deletes an image
 * @param {ObjectId|string} userId - The ID of the user making the deletion
 * @param {ObjectId|string} imageId - The ID of the image to delete
 * @returns {Promise<Object>} The deletion result
 */
export async function deleteImage(userId, imageId) {
  return await Image.deleteOne({ _id: imageId, uploader: userId })
}
