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
        <div className='blog-container flex h-screen flex-col overflow-hidden'>
            {/* Header area stays fixed at the top */}
            <div className='header-container bg-background sticky top-0 flex-shrink-0 px-4 py-4'>
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
                <Header
                    setIsModalOpen={setIsModalOpen}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                    setIsSignUpModalOpen={setIsSignUpModalOpen}
                />
            </div>

            <div className=''>
                <PostList
                    posts={posts}
                    setTags={(tag) => setTags(tag)}
                    setIsLoginModalOpen={setIsLoginModalOpen}
                    setIsSignUpModalOpen={setIsSignUpModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            </div>
        </div>
    )
}

export default Blog
