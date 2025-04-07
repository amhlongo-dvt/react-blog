import PropTypes from 'prop-types'
import { User } from './User'
import { Link } from 'react-router-dom'

import { useState } from 'react'
import { Badge } from './ui/badge'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'

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
        <Card
            className='h-48 w-full p-4'
            //  className='flex flex-col justify-between rounded-xl bg-white px-4 shadow-sm'
        >
            <CardTitle className=''>
                <h3 className='post__title font-bold text-gray-900'>{title}</h3>
            </CardTitle>

            {/* <div className='overflow-hidden pt-2'> */}
            <CardDescription
                className='line-clamp-3'
                dangerouslySetInnerHTML={{ __html: contents }}
            />
            {/* </div> */}
            <CardContent className='flex gap-0.5'>
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        // className={` ${
                        //     isTagEnabled[tag] ? 'bg-gray-700' : 'bg-gray-500'
                        // } cursor-pointer rounded-full px-2 py-1 text-sm font-semibold text-amber-50 hover:bg-gray-200 hover:text-gray-950`}
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
                    </Badge>
                ))}
            </CardContent>
            <CardFooter className='flex items-center justify-between'>
                <div>
                    <p className='post__author text text--italic text-sm font-bold text-gray-900'>
                        <User id={author} />
                    </p>
                    <p className='text-xs text-gray-500'>{formatDate()}</p>
                </div>
                <Button asChild size={'sm'}>
                    <Link
                        to={`/posts/${_id}`}
                        // className='cursor-pointer rounded-sm bg-gray-800 px-4 py-1 text-base font-medium text-gray-50 hover:bg-gray-600'
                    >
                        <h3 className='post__cta'>Read</h3>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
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
