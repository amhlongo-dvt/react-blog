import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post'

export function PostList({ posts = [] }) {
    console.log(posts)

    return (
        <div className='post-container'>
            {posts.map((post) => (
                <Fragment key={post._id}>
                    <Post {...post} />
                </Fragment>
            ))}
        </div>
    )
}
PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
