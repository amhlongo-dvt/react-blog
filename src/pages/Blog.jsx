import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreatePost } from '../components/CreatePost'
import { PostFilter } from '../components/PostFilter'
import { PostList } from '../components/PostList'
import { PostSorting } from '../components/PostSorting'
import { getPosts } from '../api/posts'
import { Header } from '../components/Header'

export function Blog() {
    const [author, setAuthor] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOder] = useState('descending')
    const postsQuery = useQuery({
        queryKey: ['posts', { author, sortBy, sortOrder }],
        queryFn: () => getPosts({ author, sortBy, sortOrder }),
    })

    const posts = postsQuery.data ?? []
    return (
        <div className='blog-container'>
            <Header />
            <CreatePost />
            <div className='sort-filter-container'>
                <PostFilter
                    field='author'
                    value={author}
                    onChange={(value) => setAuthor(value)}
                />
                <PostSorting
                    fields={['createdAt', 'updatedAt']}
                    value={sortBy}
                    onChange={(value) => setSortBy(value)}
                    orderValue={sortOrder}
                    onOrderChange={(orderValue) => setSortOder(orderValue)}
                />
            </div>
            <PostList posts={posts} />
        </div>
    )
}

export default Blog
