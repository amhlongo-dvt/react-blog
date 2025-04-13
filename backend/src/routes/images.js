import { requireAuth } from '../middleware/jwt.js'
import { createImage } from '../services/images.js'

export function postsRoutes(app) {
  app.post('/api/v1/posts', requireAuth, async (req, res) => {
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

      const post = await createImage(req.auth.sub, req.body)
      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)
      return res.status(500).end()
    }
  })
}
