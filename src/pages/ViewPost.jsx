import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getPostsById } from '../api/posts'
import { HeroSection } from '../components/HeroSection'
import { PostContent } from '../components/PostContent'
import { Header } from '../components/Header'

export function ViewPost() {
    const { postId } = useParams()
    const postQuery = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostsById(postId),
    })

    const post = postQuery.data

    return (
        <>
            <Header isPost={true} />
            <div className='flex flex-col items-center'>
                <div className='view-post-container flex w-full flex-col items-center'>
                    {post && <HeroSection title={post.title} />}
                    {post && <PostContent post={post} />}
                    {!post && (
                        <div className='animate-pulse space-y-4'>
                            <div className='h-8 w-3/4 rounded bg-gray-200'></div>
                            <div className='h-4 w-full rounded bg-gray-200'></div>
                            <div className='h-4 w-5/6 rounded bg-gray-200'></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
