import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { getPostsById } from '../api/posts'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { HeroSection } from '../components/HeroSection'

export function ViewPost() {
    const { postId } = useParams()
    const postQuery = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostsById(postId),
    })

    const post = postQuery.data
    console.log(post)

    return (
        <div className='mx-4'>
            <Link to='/' className='my-4 flex w-max items-center bg-amber-400'>
                <ArrowLeftIcon className='size-5' />
                Back
            </Link>
            <div className='flex flex-col items-center'>
                <div className='view-post-container flex w-full max-w-2xl flex-col items-center'>
                    {post && <HeroSection title={post.title} />}
                </div>
            </div>
        </div>
    )
}
