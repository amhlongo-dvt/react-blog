import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'

export function CreatePost() {
    const [title, setTitle] = useState('')
    const [token] = useAuth()
    const [contents, setContents] = useState('')
    const queryClient = useQueryClient()
    const createPostMutation = useMutation({
        mutationFn: () => createPost(token, { title, contents }),
        onSuccess: () => queryClient.invalidateQueries(['posts']),
    })

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
            <textarea
                className='input--textarea'
                value={contents}
                onChange={(e) => setContents(e.target.value)}
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
