import PropTypes from 'prop-types'
import { Post } from './Post'
import { motion } from 'framer-motion'
import { CreatePostForm } from './CreatePostFom'
import { Card } from './ui/card'

export function PostList({
    posts = [],
    setTags,
    setIsLoginModalOpen,
    setIsSignUpModalOpen,
    setIsModalOpen,
}) {
    console.log(posts)

    return (
        <div className='mb-10 flex min-h-screen w-full flex-col gap-2 px-4 md:flex-row'>
            {/* Scrollable posts section */}
            <div className='no-scrollbar h-screen w-full overflow-y-auto pb-6 md:w-3/5'>
                {posts.map((post, index) => (
                    <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className='mb-2'
                    >
                        <Post {...post} _id={post._id} setTags={setTags} />
                    </motion.div>
                ))}
            </div>

            {/* Sticky form section */}
            <div className='relative hidden w-full md:block md:w-2/5'>
                <Card className='max-h-[calc(100vh-2rem)] overflow-y-auto p-8 dark:border-0'>
                    <CreatePostForm
                        setIsLoginModalOpen={setIsLoginModalOpen}
                        setIsSignUpModalOpen={setIsSignUpModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                </Card>
            </div>
        </div>
    )
}
PostList.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
    setTags: PropTypes.func,
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
    setIsModalOpen: PropTypes.func,
}
