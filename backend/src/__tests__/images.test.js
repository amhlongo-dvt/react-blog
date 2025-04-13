import mongoose from 'mongoose'
import { describe, expect, it, beforeEach } from '@jest/globals'
import { Image } from '../db/models/image.js'

beforeEach(async () => {
  await Image.deleteMany({})
})

describe('Image Model Tests', () => {
  it('should create and save an image with all fields', async () => {
    const uploaderId = new mongoose.Types.ObjectId()
    const imageData = {
      name: 'example.png',
      type: 'image/png',
      data: 'base64encodeddata',
      alt: 'An example image',
      uploader: uploaderId,
    }

    const image = new Image(imageData)
    const savedImage = await image.save()

    // Check that the document has an _id and timestamps
    expect(savedImage._id).toBeDefined()
    expect(savedImage.createdAt).toBeInstanceOf(Date)
    expect(savedImage.updatedAt).toBeInstanceOf(Date)

    // Verify all provided fields are saved correctly
    expect(savedImage.name).toBe(imageData.name)
    expect(savedImage.type).toBe(imageData.type)
    expect(savedImage.data).toBe(imageData.data)
    expect(savedImage.alt).toBe(imageData.alt)
    expect(savedImage.uploader.toString()).toBe(uploaderId.toString())
  })

  it('should create an image with minimal fields', async () => {
    // Minimal fields: type, data, and uploader are provided.
    const uploaderId = new mongoose.Types.ObjectId()
    const imageData = {
      type: 'image/jpeg',
      data: 'base64minidata',
      uploader: uploaderId,
    }

    const image = new Image(imageData)
    const savedImage = await image.save()

    expect(savedImage._id).toBeDefined()
    expect(savedImage.type).toBe('image/jpeg')
    expect(savedImage.data).toBe('base64minidata')
    // Since name and alt were not provided, they should be undefined.
    expect(savedImage.name).toBeUndefined()
    expect(savedImage.alt).toBeUndefined()
  })

  it('should automatically add timestamps to the document', async () => {
    const uploaderId = new mongoose.Types.ObjectId()
    const imageData = {
      name: 'time.png',
      type: 'image/png',
      data: 'base64timedata',
      uploader: uploaderId,
    }

    const image = new Image(imageData)
    const savedImage = await image.save()

    expect(savedImage.createdAt).toBeInstanceOf(Date)
    expect(savedImage.updatedAt).toBeInstanceOf(Date)
    expect(savedImage.createdAt.getTime()).toEqual(
      savedImage.updatedAt.getTime(),
    )
  })

  it('should update the updatedAt timestamp after modifying the document', async () => {
    const uploaderId = new mongoose.Types.ObjectId()
    const imageData = {
      name: 'before-update.png',
      type: 'image/png',
      data: 'base64updatedata',
      alt: 'Before update',
      uploader: uploaderId,
    }

    const image = new Image(imageData)
    const savedImage = await image.save()

    const originalUpdatedAt = savedImage.updatedAt

    // Introduce a short delay to ensure a new timestamp is generated.
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Update a field and re-save the document.
    savedImage.name = 'after-update.png'
    const updatedImage = await savedImage.save()

    expect(updatedImage.name).toBe('after-update.png')
    expect(updatedImage.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime(),
    )
  })

  it('should store the uploader as a valid ObjectId', async () => {
    const uploaderId = new mongoose.Types.ObjectId()
    const image = new Image({
      type: 'image/gif',
      data: 'base64gifdata',
      uploader: uploaderId,
    })

    const savedImage = await image.save()
    expect(savedImage.uploader).toEqual(uploaderId)
  })
})
