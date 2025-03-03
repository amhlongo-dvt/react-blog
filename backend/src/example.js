import { initDatabase } from './db/init.js'
import Post from './db/models/post.js'

await initDatabase()

const post = new Post({
  title: 'My First Post',
  author: 'John Doe',
})

await post.save()

const posts = await Post.find({})

console.log(post)
