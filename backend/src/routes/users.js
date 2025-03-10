import { createUser, getUserInfoById, loginUser } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (err) {
      return res.status(400).json({
        error: 'failed to create the user, the username already exists.',
      })
    }
  })
  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return res.status(400).json({
        error: 'login failed, did you enter the correct username/password?',
      })
    }
  })

  app.get('/api/v1/user/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).send(userInfo)
  })
}
