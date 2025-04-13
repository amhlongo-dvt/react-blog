import express from 'express'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { imagesRoutes } from './routes/images.js'
const app = express()
app.use(cors())
app.use(bodyParser.json())
postsRoutes(app)
userRoutes(app)
imagesRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express')
})

export { app }
