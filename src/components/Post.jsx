import PropTypes from 'prop-types'
import { User } from './User'

export function Post({ title, contents, author }) {
    return (
        <article className='post'>
            <h3 className='post__title'>{title}</h3>
            <div className='post__contents'>{contents}</div>
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
}
