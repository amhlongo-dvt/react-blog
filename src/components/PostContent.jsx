import { format } from 'date-fns'
import DOMPurify from 'dompurify'
import { User } from './User'

import './PostContent.css'
import PropTypes from 'prop-types'
import { Badge } from './ui/badge'

export const PostContent = ({ post }) => {
    const sanitizedContent = DOMPurify.sanitize(post.contents)

    return (
        <div className='w-full max-w-4xl px-8 py-8'>
            <div className='mb-2 flex items-center gap-4'>
                <User id={post.author} oneLetter />
                <div>
                    <p className='text-sm md:text-base'>
                        <User id={post.author} />
                    </p>
                    <p className='text-sm'>
                        {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </p>
                </div>
            </div>

            {post.tags?.length > 0 && (
                <div className='flex gap-2'>
                    {post.tags.map((tag) => (
                        <Badge className='md:h-7' key={tag}>
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            <div
                className='view-post-content mt-6 text-lg md:text-xl'
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
        </div>
    )
}

PostContent.propTypes = {
    post: PropTypes.object,
}
