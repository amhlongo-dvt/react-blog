import { requireAuth } from '../middleware/jwt.js'
import { createImage, getImageById } from '../services/images.js'

export function imagesRoutes(app) {
  app.post('/api/v1/images', requireAuth, async (req, res) => {
    try {
      const { type, data } = req.body

      if (!data || !type) {
        return res
          .status(400)
          .json({ error: 'Image data and type are required' })
      }

      if (data.length > 16 * 1024 * 1024) {
        return res
          .status(400)
          .json({ error: 'Image too large for base64 encoding' })
      }

      const image = await createImage(req.auth.sub, req.body)
      return res.json({
        _id: image._id,
        name: image.name,
        type: image.type,
        data: image.data,
        alt: image.alt,
        uploader: image.uploader,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      })
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/images/:id', async (req, res) => {
    try {
      const image = await getImageById(req.params.id)

      if (!image) {
        return res.status(404).json({ error: 'Image not found' })
      }

      return res.json({
        _id: image._id,
        name: image.name,
        type: image.type,
        data: image.data,
        alt: image.alt,
        uploader: image.uploader,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      })
    } catch (err) {
      console.error('Error retrieving image:', err)
      return res.status(500).json({ error: 'Failed to retrieve image' })
    }
  })
}
