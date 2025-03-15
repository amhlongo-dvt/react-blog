import PropTypes from 'prop-types'
import { User } from './User'

export function Post({ title, contents, author }) {
    return (
        <article className='post'>
            <h3 className='post__title'>{title}</h3>
            <div className='post__contents'>{contents}</div>
            {author && (
                <em className='post__author'>
                    Written by <User id={author} />
                </em>
            )}
        </article>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
}
