import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreatePost } from '../components/CreatePost'
// import { PostFilter } from '../components/PostFilter'
import { PostList } from '../components/PostList'
// import { PostSorting } from '../components/PostSorting'
import { getPosts } from '../api/posts'
import { Header } from '../components/Header'
// import { CommandLineIcon } from '@heroicons/react/16/solid'
import { Login } from './Login'
import { Signup } from './Signup'

export function Blog() {
    const [author] = useState('')
    const [sortBy] = useState('createdAt')
    const [sortOrder] = useState('descending')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
    const [tags, setTags] = useState('')
    const postsQuery = useQuery({
        queryKey: ['posts', { author, sortBy, sortOrder, tags }],
        queryFn: () => getPosts({ author, sortBy, sortOrder, tags }),
    })

    const posts = postsQuery.data ?? []
    return (
        <div className='blog-container'>
            <div className='header-container sticky top-0 bg-gray-100 px-4'>
                <CreatePost
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
                <Login
                    isLoginModalOpen={isLoginModalOpen}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                />
                <Signup
                    isSignUpModalOpen={isSignUpModalOpen}
                    setIsSignUpModalOpen={setIsSignUpModalOpen}
                />

                {/* <PostFilter
                        field='author'
                        value={author}
                        onChange={(value) => setAuthor(value)}
                    /> */}
                {/* <PostSorting
                        fields={['createdAt', 'updatedAt']}
                        value={sortBy}
                        onChange={(value) => setSortBy(value)}
                        orderValue={sortOrder}
                        onOrderChange={(orderValue) => setSortOder(orderValue)}
                    /> */}
                <Header
                    setIsModalOpen={setIsModalOpen}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                    setIsSignUpModalOpen={setIsSignUpModalOpen}
                />
            </div>
            <PostList posts={posts} setTags={(tag) => setTags(tag)} />
        </div>
    )
}

export default Blog
