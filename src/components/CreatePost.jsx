import PropTypes from 'prop-types'
import './CreatePost.css'
// Shadcn UI components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import { CreatePostForm } from './CreatePostFom'

export function CreatePost({ isModalOpen, setIsModalOpen }) {
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className='sm:max-w-3xl'>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold'>
                        Create Blog Post
                    </DialogTitle>
                </DialogHeader>
                <CreatePostForm setIsModalOpen={setIsModalOpen} />
            </DialogContent>
        </Dialog>
    )
}

CreatePost.propTypes = {
    setIsModalOpen: PropTypes.func,
    isModalOpen: PropTypes.bool,
}
