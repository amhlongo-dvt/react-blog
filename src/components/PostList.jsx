import PropTypes from 'prop-types'
import { Post } from './Post'
import { motion } from 'framer-motion'

export function PostList({ posts = [], setTags }) {
    console.log(posts)

    return (
        <div className='post-container mt-4 grid grid-cols-1 gap-2 px-4'>
            {posts.map((post, index) => (
                <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className='post-item'
                >
                    <Post {...post} _id={post._id} setTags={setTags} />
                </motion.div>
            ))}
        </div>
    )
}
PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
    setTags: PropTypes.func,
}
