import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Post } from '../components/Post'
import { getPostsById } from '../api/posts'

export function ViewPost() {
    const { postId } = useParams()
    const postQuery = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostsById(postId),
    })

    const post = postQuery.data
    console.log(post)

    return (
        <div className='view-post-container'>
            <Header />
            <Link to='/'>Back to main page</Link>
            {post ? (
                <Post {...post} fullPost />
            ) : (
                `Post with the id ${postId} not found`
            )}
        </div>
    )
}

ViewPost.propTypes = {
    postId: PropTypes.string.isRequired,
}
