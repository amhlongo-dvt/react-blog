import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'
import ReactQuill from 'react-quill'
// import '../../node_modules/react-quill/dist/quill.snow.css'
import { WithContext as ReactTags } from 'react-tag-input'
export function CreatePost() {
    const [token] = useAuth()
    const [title, setTitle] = useState('')
    const [contents, setContents] = useState('')
    const [tags, setTags] = useState([])

    const queryClient = useQueryClient()
    const createPostMutation = useMutation({
        mutationFn: () => {
            createPost(token, {
                title,
                contents,
                tags: tags.map((tag) => tag.text),
            })
        },
        onSuccess: () => queryClient.invalidateQueries(['posts']),
    })

    const modules = {
        toolbar: [
            [{ header: [1, 3, 6, false] }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
        ],
    }

    const handleTagDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i))
    }

    const handleTagAddition = (tag) => {
        setTags([...tags, tag])
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

            <ReactTags
                tags={tags}
                handleDelete={handleTagDelete}
                handleAddition={handleTagAddition}
                classNames={{
                    tags: 'flex flex-wrap gap-2 mb-2',
                    tag: 'bg-blue-500 text-white px-2 py-1 rounded-full text-sm',
                    remove: 'ml-2 cursor-pointer hover:bg-blue-700 rounded-full p-1',
                    suggestions:
                        'absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg',
                    suggestion: 'p-2 hover:bg-gray-200 cursor-pointer',
                    activeSuggestion: 'bg-gray-300',
                }}
                placeholder='Add a tag'
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
