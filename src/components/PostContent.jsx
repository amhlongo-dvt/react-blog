import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { User } from './User'

import './PostContent.css'
import PropTypes from 'prop-types'

export const PostContent = ({ post }) => {
    const sanitizedContent = DOMPurify.sanitize(post.contents)

    return (
        <div>
            <div>
                <div>
                    <span>{post.author?.charAt(0) || 'A'}</span>
                </div>
                <div>
                    <p>
                        <User id={post.author} />
                    </p>
                    <p>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
                </div>
            </div>

            <div
                className='ql-editor'
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {post.tags?.length > 0 && (
                <div>
                    {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

PostContent.propTypes = {
    post: PropTypes.object,
}
