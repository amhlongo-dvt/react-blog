import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'
import ReactQuill from 'react-quill'
import { WithContext as ReactTags } from 'react-tag-input'
export function CreatePost() {
    const [token] = useAuth()
    const [title, setTitle] = useState('')
    const [contents, setContents] = useState('')
    const [tags, setTags] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(true)

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
        setTitle('')
        setTags([])
        setContents('')
        setIsModalOpen(false)
    }

    if (!token)
        return (
            <div className='alert-container'>
                {' '}
                <p className='text'>Please login to create new posts</p>{' '}
            </div>
        )

    return (
        <div className='flex items-center justify-center'>
            {isModalOpen && (
                <div>
                    <div>
                        {/* Background Overlay */}
                        <div>
                            <div></div>
                        </div>

                        {/*Modal Content*/}
                        <span>&#8203;</span>
                        <div>
                            <h3>Create Blog Post</h3>
                            <form onSubmit={handleSubmit} className='form'>
                                <div>
                                    <label htmlFor='title'>Title</label>
                                    <input
                                        type='text'
                                        className='input--text'
                                        name='create-title'
                                        id='create-title'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />
                                </div>

                                <div>
                                    <label htmlFor='tags'>Tags</label>
                                    <ReactTags
                                        tags={tags}
                                        handleDelete={handleTagDelete}
                                        handleAddition={handleTagAddition}
                                        classNames={{}}
                                        placeholder='Add a tag'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='content'>Content</label>
                                    <ReactQuill
                                        theme='snow'
                                        value={contents}
                                        onChange={(e) => setContents(e)}
                                        modules={modules}
                                    />
                                </div>

                                <div>
                                    <input
                                        className='button button--success'
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
                                    <input
                                        className='button button--success'
                                        type='submit'
                                        value={'Cancel'}
                                        disabled={createPostMutation.isPending}
                                    />
                                </div>

                                {createPostMutation.isSuccess ? (
                                    <p className='text'>
                                        Post created successfully
                                    </p>
                                ) : null}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
