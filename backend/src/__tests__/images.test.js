import mongoose from 'mongoose'
import { describe, expect, it, beforeAll, beforeEach } from '@jest/globals'
import { Image } from '../db/models/image.js'
import {
  createImage,
  getImageById,
  listImagesByUploader,
  updateImage,
  deleteImage,
} from '../services/images.js'
import { createUser } from '../services/users.js'
import { Post } from '../db/models/post.js'

// Test data
let testUser = null
let secondUser = null
const sampleImageData = {
  name: 'sample-image.jpg',
  type: 'image/jpeg',
  data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...',
  alt: 'Sample image description',
}

// Setup database connection
beforeAll(async () => {
  // Create test users for use in tests
  testUser = await createUser({
    username: 'imagetest',
    password: 'password123',
  })
  secondUser = await createUser({
    username: 'anotheruser',
    password: 'password123',
  })
})

// Clean up test data between tests
beforeEach(async () => {
  await Image.deleteMany({})
  await Post.deleteMany({})
})

describe('Image Service - createImage', () => {
  it('should create an image with all required fields', async () => {
    const image = await createImage(testUser._id, sampleImageData)

    expect(image._id).toBeDefined()
    expect(image.name).toBe(sampleImageData.name)
    expect(image.type).toBe(sampleImageData.type)
    expect(image.data).toBe(sampleImageData.data)
    expect(image.alt).toBe(sampleImageData.alt)
    expect(image.uploader.toString()).toBe(testUser._id.toString())
    expect(image.createdAt).toBeInstanceOf(Date)
    expect(image.updatedAt).toBeInstanceOf(Date)
  })

  it('should create an image with only minimal required fields', async () => {
    const minimalData = {
      type: 'image/png',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...',
    }

    const image = await createImage(testUser._id, minimalData)

    expect(image._id).toBeDefined()
    expect(image.type).toBe(minimalData.type)
    expect(image.data).toBe(minimalData.data)
    // Default values should be provided
    expect(image.name).toBe('Untitled')
    expect(image.alt).toBe('')
  })

  it('should fail if image type is missing', async () => {
    const missingType = {
      name: 'missing-type.jpg',
      data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA...',
      alt: 'Test image',
    }

    await expect(createImage(testUser._id, missingType)).rejects.toThrow()
  })

  it('should fail if image data is missing', async () => {
    const missingData = {
      name: 'missing-data.jpg',
      type: 'image/jpeg',
      alt: 'Test image',
    }

    await expect(createImage(testUser._id, missingData)).rejects.toThrow()
  })

  it('should fail if uploader ID is not provided', async () => {
    await expect(createImage(null, sampleImageData)).rejects.toThrow()
  })

  it('should truncate very large alt text', async () => {
    const longAlt = 'a'.repeat(1000) // Very long alt text
    const data = { ...sampleImageData, alt: longAlt }

    const image = await createImage(testUser._id, data)

    // Assuming there's a maximum length for alt text like 255 characters
    expect(image.alt.length).toBeLessThanOrEqual(255)
  })
})

describe('Image Service - getImageById', () => {
  it('should retrieve an image by its ID', async () => {
    // First, create an image
    const createdImage = await createImage(testUser._id, sampleImageData)

    // Then retrieve it by ID
    const retrievedImage = await getImageById(createdImage._id)

    expect(retrievedImage).not.toBeNull()
    expect(retrievedImage._id.toString()).toBe(createdImage._id.toString())
    expect(retrievedImage.name).toBe(sampleImageData.name)
  })

  it('should return null for a non-existent image ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const image = await getImageById(nonExistentId)

    expect(image).toBeNull()
  })

  it('should reject with an error for an invalid ID format', async () => {
    await expect(getImageById('invalid-id')).rejects.toThrow()
  })
})

describe('Image Service - listImagesByUploader', () => {
  it('should return all images uploaded by a specific user', async () => {
    // Create multiple images for the test user
    await createImage(testUser._id, sampleImageData)
    await createImage(testUser._id, {
      name: 'another-image.png',
      type: 'image/png',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...',
    })

    // Create an image for a different user
    await createImage(secondUser._id, {
      name: 'other-user-image.png',
      type: 'image/png',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...',
    })

    const userImages = await listImagesByUploader(testUser._id)

    expect(userImages.length).toBe(2)
    userImages.forEach((image) => {
      expect(image.uploader.toString()).toBe(testUser._id.toString())
    })
  })

  it('should return an empty array if the user has no images', async () => {
    const userWithNoImages = await createUser({
      username: 'noimages',
      password: 'test123',
    })
    const images = await listImagesByUploader(userWithNoImages._id)

    expect(images).toBeInstanceOf(Array)
    expect(images.length).toBe(0)
  })

  it('should return an empty array for a non-existent user ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const images = await listImagesByUploader(nonExistentId)

    expect(images).toBeInstanceOf(Array)
    expect(images.length).toBe(0)
  })
})

describe('Image Service - updateImage', () => {
  let createdImage

  beforeEach(async () => {
    // Create a test image before each update test
    createdImage = await createImage(testUser._id, sampleImageData)
  })

  it('should update the name and alt text of an image', async () => {
    const updates = {
      name: 'updated-name.jpg',
      alt: 'Updated description',
    }

    const updatedImage = await updateImage(
      testUser._id,
      createdImage._id,
      updates,
    )

    expect(updatedImage.name).toBe(updates.name)
    expect(updatedImage.alt).toBe(updates.alt)
    expect(updatedImage.type).toBe(createdImage.type) // Type should remain unchanged
    expect(updatedImage.data).toBe(createdImage.data) // Data should remain unchanged
  })

  it('should update only specified fields', async () => {
    const partialUpdates = {
      name: 'only-name-updated.jpg',
    }

    const updatedImage = await updateImage(
      testUser._id,
      createdImage._id,
      partialUpdates,
    )

    expect(updatedImage.name).toBe(partialUpdates.name)
    expect(updatedImage.alt).toBe(createdImage.alt) // Alt should remain unchanged
  })

  it('should not allow updating image data or type', async () => {
    const newData = 'data:image/png;base64,NEW_DATA'
    const newType = 'image/gif'

    const attemptedUpdate = await updateImage(testUser._id, createdImage._id, {
      data: newData,
      type: newType,
      name: 'new-name.gif',
    })

    // Name should update, but data and type should not
    expect(attemptedUpdate.name).toBe('new-name.gif')
    expect(attemptedUpdate.data).not.toBe(newData)
    expect(attemptedUpdate.type).not.toBe(newType)
    expect(attemptedUpdate.data).toBe(createdImage.data)
    expect(attemptedUpdate.type).toBe(createdImage.type)
  })

  it("should not allow a user to update another user's image", async () => {
    const result = await updateImage(secondUser._id, createdImage._id, {
      name: 'attempted-update.jpg',
    })

    // Should return null (or throw, depending on implementation)
    expect(result).toBeNull()

    // Verify the image wasn't actually changed
    const unchangedImage = await getImageById(createdImage._id)
    expect(unchangedImage.name).toBe(createdImage.name)
  })

  it('should return null for a non-existent image ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const result = await updateImage(testUser._id, nonExistentId, {
      name: 'doesnt-exist.jpg',
    })

    expect(result).toBeNull()
  })
})

describe('Image Service - deleteImage', () => {
  it('should delete an image when requested by its uploader', async () => {
    const image = await createImage(testUser._id, sampleImageData)

    const deleteResult = await deleteImage(testUser._id, image._id)

    expect(deleteResult.deletedCount).toBe(1)

    // Verify image is actually gone
    const deletedImage = await getImageById(image._id)
    expect(deletedImage).toBeNull()
  })

  it("should not allow a user to delete another user's image", async () => {
    const image = await createImage(testUser._id, sampleImageData)

    const deleteResult = await deleteImage(secondUser._id, image._id)

    expect(deleteResult.deletedCount).toBe(0)

    // Verify image still exists
    const stillExistsImage = await getImageById(image._id)
    expect(stillExistsImage).not.toBeNull()
  })

  it('should return a successful result for a non-existent image ID', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const deleteResult = await deleteImage(testUser._id, nonExistentId)

    expect(deleteResult.deletedCount).toBe(0)
  })
})

describe('Image Service - Integration with Posts', () => {
  it('should allow associating an image with a post', async () => {
    // Create an image
    const image = await createImage(testUser._id, sampleImageData)

    // Create a post that references the image
    const post = new Post({
      title: 'Post with image',
      author: testUser._id,
      contents: 'This post has a featured image',
      tags: ['test', 'image'],
      featuredImageId: image._id,
    })

    await post.save()

    // Retrieve the post and populate the image
    const retrievedPost = await Post.findById(post._id).populate(
      'featuredImageId',
    )

    expect(retrievedPost.featuredImageId).not.toBeNull()
    expect(retrievedPost.featuredImageId._id.toString()).toBe(
      image._id.toString(),
    )
    expect(retrievedPost.featuredImageId.name).toBe(sampleImageData.name)
  })

  it('should handle multiple posts referencing the same image', async () => {
    // Create a shared image
    const sharedImage = await createImage(testUser._id, sampleImageData)

    // Create multiple posts that reference the same image
    const post1 = new Post({
      title: 'First post with shared image',
      author: testUser._id,
      contents: 'First post content',
      featuredImageId: sharedImage._id,
    })

    const post2 = new Post({
      title: 'Second post with shared image',
      author: testUser._id,
      contents: 'Second post content',
      featuredImageId: sharedImage._id,
    })

    await post1.save()
    await post2.save()

    // Find all posts with the shared image
    const postsWithImage = await Post.find({ featuredImageId: sharedImage._id })

    expect(postsWithImage.length).toBe(2)
  })

  it('should handle orphaned posts when an image is deleted', async () => {
    // This test depends on your application's behavior when an image is deleted
    // Some options: set featuredImageId to null, cascade delete, keep the reference but handle missing images in UI

    // Create an image
    const image = await createImage(testUser._id, sampleImageData)

    // Create a post with the image
    const post = new Post({
      title: 'Post with image that will be deleted',
      author: testUser._id,
      contents: 'Test content',
      featuredImageId: image._id,
    })

    await post.save()

    // Delete the image
    await deleteImage(testUser._id, image._id)

    // Check post behavior after image deletion
    const postAfterImageDeletion = await Post.findById(post._id)

    // The post should still exist
    expect(postAfterImageDeletion).not.toBeNull()

    // Attempting to populate a deleted reference will result in null for that field
    const populatedPost = await Post.findById(post._id).populate(
      'featuredImageId',
    )
    expect(populatedPost.featuredImageId).toBeNull()
  })
})
