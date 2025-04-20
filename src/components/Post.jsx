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
import { getImageById } from '../api/images'
import { useQuery } from '@tanstack/react-query'
import { base64ToDataUrl } from '../lib/utils'

export function Post({
    title,
    contents,
    author,
    _id,
    createdAt,
    tags,
    featuredImageId,
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
    let imageUrl = ''
    const placeholder = 'https://placehold.co/600x400/000000/FFFFFF/png'

    if (featuredImageId) {
        const imageQuery = useQuery({
            queryKey: ['image', featuredImageId],
            queryFn: () => getImageById(featuredImageId),
        })
        const image = imageQuery.data ?? ''
        imageUrl = base64ToDataUrl(image.data, image.type)
    }

    return (
        <Card className='h-full w-full py-4 dark:border-0'>
            <Link
                to={`/posts/${_id}`}
                className='flex flex-row justify-start gap-4 px-4'
            >
                <img
                    src={imageUrl ? imageUrl : placeholder}
                    alt=''
                    className='h-32 w-32 rounded-md'
                />
                <div className='flex w-full flex-col justify-between'>
                    <CardTitle className=''>
                        <h3 className='post__title font-bold'>{title}</h3>
                    </CardTitle>
                    <CardDescription
                        className='line-clamp-1 text-sm lg:line-clamp-2'
                        dangerouslySetInnerHTML={{ __html: contents }}
                    />
                    <CardContent className='flex gap-0.5'>
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className={`hover:bg-accent-foreground hover:text-accent cursor-pointer`}
                                variant={`${
                                    isTagEnabled[tag] ? '' : 'outline'
                                }`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
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
                    <CardFooter className='flex w-full flex-col flex-wrap content-end items-end'>
                        <p className='post__author text text--italic text-sm font-bold text-gray-900'>
                            <User id={author} />
                        </p>
                        <p className='text-xs text-gray-500'>{formatDate()}</p>

                        {/* <Button asChild size={'sm'}>
                            <Link
                                to={`/posts/${_id}`}
                                // className='cursor-pointer rounded-sm bg-gray-800 px-4 py-1 text-base font-medium text-gray-50 hover:bg-gray-600'
                            >
                                <h3 className='post__cta'>Read</h3>
                            </Link>
                        </Button> */}
                    </CardFooter>
                </div>
            </Link>
        </Card>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    _id: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    featuredImageId: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    setTags: PropTypes.func,
}
