import PropTypes from 'prop-types'
import { User } from './User'
import { Link } from 'react-router-dom'

export function Post({ title, contents, author, _id, fullPost = false }) {
    return (
        <article className='post'>
            {fullPost ? (
                <h3 className='post__title'>{title}</h3>
            ) : (
                <Link to={`/posts/${_id}`}>
                    <h3 className='post__title'>{title}</h3>
                </Link>
            )}
            {fullPost && <div className='post__contents'>{contents}</div>}

            {author && (
                <p className='post__author text text--italic'>
                    Written by <User id={author} />
                </p>
            )}
        </article>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    _id: PropTypes.string.isRequired,
    fullPost: PropTypes.bool,
}
