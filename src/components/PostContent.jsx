import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { User } from './User'

import './PostContent.css'
import PropTypes from 'prop-types'

export const PostContent = ({ post }) => {
    const sanitizedContent = DOMPurify.sanitize(post.contents)

    return (
        <div className='relative z-20 mx-4 w-full max-w-3xl rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-6 flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300'>
                    <span className='font-medium text-gray-600'>
                        <User id={post.author} oneLetter />
                    </span>
                </div>
                <div>
                    <p className='font-medium text-gray-900'>
                        <User id={post.author} />
                    </p>
                    <p className='text-sm text-gray-500'>
                        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </p>
                </div>
            </div>

            {post.tags?.length > 0 && (
                <div className='mb-8 flex flex-wrap gap-2'>
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className='rounded-full bg-gray-200 px-3 py-1 text-sm'
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div
                className='ql-editor'
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </div>
    )
}

PostContent.propTypes = {
    post: PropTypes.object,
}
