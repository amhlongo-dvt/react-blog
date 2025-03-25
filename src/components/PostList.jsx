import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post'

export function PostList({ posts = [], setTags }) {
    console.log(posts)

    return (
        <div className='post-container mt-4 grid grid-cols-3 gap-2'>
            {posts.map((post) => (
                <Fragment key={post._id}>
                    <Post {...post} _id={post._id} setTags={setTags} />
                </Fragment>
            ))}
        </div>
    )
}
PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
    setTags: PropTypes.func,
}
