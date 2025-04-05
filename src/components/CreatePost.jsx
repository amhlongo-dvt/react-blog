import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'
import ReactQuill from 'react-quill'
import { WithContext as ReactTags } from 'react-tag-input'
import './CreatePost.css'
import PropTypes from 'prop-types'
export function CreatePost({ isModalOpen, setIsModalOpen }) {
    const [token] = useAuth()
    const [title, setTitle] = useState('')
    const [contents, setContents] = useState('')
    const [tags, setTags] = useState([])

    const KeyCodes = {
        comma: 188,
        enter: 13,
    }

    const delimiters = [KeyCodes.comma, KeyCodes.enter]

    const queryClient = useQueryClient()
    const createPostMutation = useMutation({
        mutationFn: () => {
            createPost(token, {
                title,
                contents,
                tags: tags.map((tag) => tag.text),
            })
        },

        onSuccess: () => {
            setTitle('')
            setTags([])
            setContents('')
            setIsModalOpen(false)

            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    queryClient.invalidateQueries(['posts'])
    const modules = {
        toolbar: [
            [{ header: [false, 6, 3, 1] }, { font: [] }],
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
        console.log(createPostMutation.isPending)

        createPostMutation.mutate()
    }

    if (!token)
        return (
            <div className='alert-container'>
                {/* {' '}
                <p className='text'>Please login to create new posts</p>{' '} */}
            </div>
        )

    return (
        <div className='flex items-center justify-center'>
            {isModalOpen && (
                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div className='flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                        {/* Background Overlay */}
                        <div
                            className='fixed inset-0 transition-opacity'
                            aria-hidden='true'
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                        </div>

                        {/*Modal Content*/}
                        <span
                            className='hidden sm:inline-block sm:h-screen sm:align-middle'
                            aria-hidden='true'
                        >
                            &#8203;
                        </span>
                        <div
                            className='inline-block w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-3xl sm:align-middle'
                            role='dialog'
                            aria-modal='true'
                            aria-labelledby='modal-headline'
                        >
                            <h3 className='mb-4 text-center text-2xl leading-6 font-bold text-gray-900'>
                                Create Blog Post
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className='form space-y-6'
                            >
                                <div>
                                    <label
                                        htmlFor='title'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Title
                                    </label>
                                    <input
                                        type='text'
                                        className='mt-1 block w-full rounded-md border border-gray-300 px-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-0'
                                        name='title'
                                        id='title'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor='tags'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Tags
                                    </label>
                                    <ReactTags
                                        tags={tags}
                                        handleDelete={handleTagDelete}
                                        handleAddition={handleTagAddition}
                                        delimiters={delimiters}
                                        inputFieldPosition='bottom'
                                        placeholder='Add tags'
                                        classNames={{
                                            tagInputField:
                                                'mt-1 block px-2 w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-0',
                                            tag: 'inline-block bg-gray-800 text-amber-50 px-2 rounded mr-2 mb-2',
                                            remove: 'ml-2 pl-0.5 hover:text-blue-800 cursor-pointer',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        className='block text-sm font-medium text-gray-700'
                                        htmlFor='content'
                                    >
                                        Content
                                    </label>

                                    <ReactQuill
                                        // theme='snow'
                                        value={contents}
                                        onChange={(e) => setContents(e)}
                                        modules={modules}
                                        placeholder='Write your blog content here... '
                                    />
                                </div>

                                <div className='flex justify-end space-x-4'>
                                    <input
                                        className='rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300'
                                        type='button'
                                        onClick={() => {
                                            setTitle('')
                                            setTags([])
                                            setContents('')
                                            setIsModalOpen(false)
                                        }}
                                        value={'Cancel'}
                                        disabled={createPostMutation.isPending}
                                    />
                                    <input
                                        className='rounded bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-950 disabled:bg-gray-300'
                                        type='submit'
                                        value={
                                            createPostMutation.isPending
                                                ? 'Creating...'
                                                : 'Create'
                                        }
                                        disabled={
                                            !title ||
                                            createPostMutation.isPending
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

CreatePost.propTypes = {
    setIsModalOpen: PropTypes.func,
    isModalOpen: PropTypes.bool,
}
