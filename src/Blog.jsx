import { CreatePost } from './components/CreatePost'
import { PostFilter } from './components/PostFilter'
import { PostList } from './components/PostList'
import { PostSorting } from './components/PostSorting'

const posts = [
  {
    title: 'Hello',
    contents: 'Im a good boy and a billionaire',
    author: 'Mr. West',
  },
  {
    title: 'Hello React!',
  },
]

export function Blog() {
  return (
    <div style={{ padding: 16 }}>
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter field='author' />
      <br />
      <PostSorting fields={['createdAt', 'updatedAt']} />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}

export default Blog
