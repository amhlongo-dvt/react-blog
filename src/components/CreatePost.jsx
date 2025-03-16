import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'
import ReactQuill from 'react-quill'
// import '../../node_modules/react-quill/dist/quill.snow.css'

export function CreatePost() {
    const [title, setTitle] = useState('')
    const [token] = useAuth()
    const [contents, setContents] = useState('')
    const queryClient = useQueryClient()
    const createPostMutation = useMutation({
        mutationFn: () => createPost(token, { title, contents }),
        onSuccess: () => queryClient.invalidateQueries(['posts']),
    })

    const modules = {
        toolbar: [
            [{ header: [1, 3, 6, false] }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
        ],
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createPostMutation.mutate()
    }
    if (!token)
        return (
            <div className='alert-container'>
                {' '}
                <p className='text'>Please login to create new posts</p>{' '}
            </div>
        )

    return (
        <form onSubmit={handleSubmit} className='form'>
            <input
                type='text'
                className='input--text'
                name='create-title'
                id='create-title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <ReactQuill
                value={contents}
                onChange={(e) => setContents(e)}
                modules={modules}
            />
            <input
                className='button button--success'
                type='submit'
                value={createPostMutation.isPending ? 'Creating...' : 'Create'}
                disabled={!title || createPostMutation.isPending}
            />

            {createPostMutation.isSuccess ? (
                <p className='text'>Post created successfully</p>
            ) : null}
        </form>
    )
}
