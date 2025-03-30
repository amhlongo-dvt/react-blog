import PropTypes from 'prop-types'
import { User } from './User'
import { Link } from 'react-router-dom'

import { useState } from 'react'

export function Post({
    title,
    contents,
    author,
    _id,
    createdAt,
    tags,
    setTags,
}) {
    const formatDate = () => {
        const date = new Date(createdAt)
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
    }

    const [isTagEnabled, setIsTagEnabled] = useState({})

    const toggleTag = (tag) => {
        setIsTagEnabled((prev) => ({
            ...prev,
            [tag]: !prev[tag],
        }))
    }

    return (
        <article className='grid justify-between rounded-xl border-2 border-gray-900 px-3'>
            <div className='pt-4'>
                <h3 className='post__title line-clamp-2 font-bold text-gray-900'>
                    {title}
                </h3>
            </div>

            <div className='overflow-hidden pt-2'>
                <div
                    className='line-clamp-3 text-sm text-gray-600'
                    dangerouslySetInnerHTML={{ __html: contents }}
                />
            </div>
            <div className='mt-2 flex gap-0.5'>
                {tags.map((tag) => (
                    <button
                        key={tag}
                        className={` ${
                            isTagEnabled[tag] ? 'bg-gray-700' : 'bg-gray-500'
                        } cursor-pointer rounded-full px-2 py-1 text-sm font-semibold text-amber-50 hover:bg-gray-200 hover:text-gray-950`}
                        onClick={() => {
                            if (isTagEnabled[tag]) {
                                setTags('')
                                toggleTag(tag)
                                console.log(`tag:${tag} clicked`)
                            } else {
                                setTags(tag)
                                setIsTagEnabled(true)
                                toggleTag(tag)
                            }
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <div className='flex items-center justify-between pt-2 pb-4'>
                <div>
                    <p className='post__author text text--italic text-sm font-bold text-gray-900'>
                        <User id={author} />
                    </p>
                    <p className='text-xs text-gray-500'>{formatDate()}</p>
                </div>
                <Link
                    to={`/posts/${_id}`}
                    className='cursor-pointer rounded-sm bg-gray-800 px-4 py-1 text-base font-medium text-gray-50 hover:bg-gray-600'
                >
                    <h3 className='post__cta'>Read</h3>
                </Link>
            </div>
        </article>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    setTags: PropTypes.func,
}
