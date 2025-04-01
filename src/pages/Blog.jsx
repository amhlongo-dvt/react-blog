import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CreatePost } from '../components/CreatePost'
import { PostFilter } from '../components/PostFilter'
import { PostList } from '../components/PostList'
import { PostSorting } from '../components/PostSorting'
import { getPosts } from '../api/posts'
import { Header } from '../components/Header'
import { CommandLineIcon } from '@heroicons/react/16/solid'
import { Login } from './Login'
import { Signup } from './Signup'

export function Blog() {
    const [author, setAuthor] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOder] = useState('descending')
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
        <div className='blog-container mx-4'>
            <div className='header-container'>
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
                <div className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center'>
                        <CommandLineIcon className='size-6' />
                        <p className='logo-name text-xl font-bold text-gray-950'>
                            Syntax
                        </p>
                    </div>

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
                    <Header
                        setIsModalOpen={setIsModalOpen}
                        setIsLoginModalOpen={setIsLoginModalOpen}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                    />
                </div>
            </div>
            <PostList posts={posts} setTags={(tag) => setTags(tag)} />
        </div>
    )
}

export default Blog
