import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { LockIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { createPost } from '../api/posts'
import { useAuth } from '../contexts/AuthContext'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import './CreatePost.css'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { createImage } from '../api/images'
import { fileToBase64 } from '../lib/utils'
import { Progress } from './ui/progress'

const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
]

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    featuredImageId: z.string().min(1, 'Picture is required'),
})

export function CreatePostForm({
    setIsLoginModalOpen,
    setIsSignUpModalOpen,
    setIsModalOpen,
}) {
    const [token] = useAuth()
    const [contents, setContents] = useState('')
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isConverting, setIsConverting] = useState(false)
    const fileInputRef = useRef(null)

    const queryClient = useQueryClient()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            featuredImageId: null,
        },
    })

    // Quill editor modules configuration
    const modules = {
        toolbar: [
            [{ header: [false, 6, 3, 1] }, { font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline'],
        ],
    }

    const uploadMutation = useMutation({
        mutationFn: (values) => {
            return createImage(token, {
                name: values.name,
                type: values.type,
                data: values.data,
                alt: values.name,
            })
        },

        onSuccess: (data) => {
            console.log('Upload successful, ID', data._id)
            form.setValue('featuredImageId', data._id, { shouldValidate: true })
            setUploadProgress(100)
            toast.success('Image uploaded successfully!')
            console.log(form.getValues())
        },
        onError: (error) => {
            console.error('Upload failed', error)
            form.setValue('featuredImageId', '', { shouldValidate: true })
            setPreviewUrl(null)
            setUploadProgress(0)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            toast.error('Upload Failed', {
                description: error.message || 'Could not upload picture',
            })
        },

        onMutate: () => {
            setUploadProgress(0)

            const interval = setInterval(() => {
                setUploadProgress((oldProgress) => {
                    if (oldProgress >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return oldProgress + 10
                })
            }, 150)
        },
    })

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }

        form.setValue('featuredImageId', '', { shouldValidate: true })
        uploadMutation.reset()
        setUploadProgress(0)
        if (file) {
            setIsConverting(true)
            setPreviewUrl(URL.createObjectURL(file))
            try {
                const base64Data = await fileToBase64(file)

                const payload = {
                    name: file.name,
                    type: file.type,
                    data: base64Data,
                    alt: file.name,
                }
                console.log(payload)

                setIsConverting(false)
                uploadMutation.mutate(payload)
            } catch (error) {
                console.error('Base64 conversion failed', error)
                setIsConverting(false)
                toast.error('Failed to read file', {
                    description: error.message,
                })
                setPreviewUrl(null)
            }
        } else {
            setIsConverting(false)
            console.log('file not uploaded')
        }
    }

    const createPostMutation = useMutation({
        mutationFn: (values) => {
            return createPost(token, {
                title: values.title,
                contents,
                tags: tags.map((tag) => tag.text),
                featuredImageId: values.featuredImageId,
            })
        },
        onSuccess: () => {
            form.reset()
            setTags([])
            setContents('')
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
        onError: (error) => {
            console.error('Failed to create post:', error)
            form.setError('root', {
                message: 'Failed to create post. Please try again.',
            })
        },
    })

    // Tag management functions
    const handleTagDelete = (tagToDelete) => {
        setTags(tags.filter((tag) => tag.id !== tagToDelete.id))
    }

    const handleTagAddition = () => {
        const trimmedInput = tagInput.trim()
        if (
            trimmedInput &&
            !tags.find(
                (tag) => tag.text.toLowerCase() === trimmedInput.toLowerCase(),
            )
        ) {
            const newTag = {
                id: `${trimmedInput}-${Date.now()}`,
                text: trimmedInput,
            }
            setTags([...tags, newTag])
            setTagInput('')
        }
    }

    const handleTagKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ',') && tagInput) {
            e.preventDefault()
            handleTagAddition()
        }
    }

    function onSubmit(values) {
        console.log('Form submitted with:', values)

        createPostMutation.mutate(values)
    }

    if (!token) {
        if (!token) {
            return (
                <Card className='mx-auto w-full'>
                    <CardHeader className='flex flex-col items-center'>
                        <div className='bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                            <LockIcon className='text-primary h-6 w-6' />
                        </div>
                        <CardTitle>Sign in to create posts</CardTitle>
                        <CardDescription className='p-0 text-center'>
                            Join our community to share your thoughts and ideas
                            with others.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center'>
                        <p className='text-muted-foreground text-center text-sm'>
                            Create an account to start posting content and
                            interacting with other members of the Syntax
                            community.
                        </p>
                    </CardContent>
                    <CardFooter className='flex justify-center gap-4'>
                        <Button
                            variant='ghost'
                            onClick={() => setIsLoginModalOpen(true)}
                        >
                            Log In
                        </Button>

                        <Button onClick={() => setIsSignUpModalOpen(true)}>
                            Sign Up
                        </Button>
                    </CardFooter>
                </Card>
            )
        }
        // No UI shown when not logged in
    }

    const isLoading = isConverting || uploadMutation.isPending
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='Enter post title'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='featuredImageId'
                    render={({ field: { onBlur, name } }) => (
                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <Input
                                    type='file'
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    name={name}
                                    ref={fileInputRef}
                                    onBlur={onBlur}
                                    disabled={isLoading}
                                    onChange={handleFileChange}
                                />
                            </FormControl>
                            {isLoading && (
                                <div>
                                    <Progress
                                        value={uploadProgress}
                                        className='w-full'
                                    />
                                    <p className='text-muted-foreground text-sm'>
                                        {isConverting
                                            ? 'Processing file...'
                                            : 'Uploading...'}
                                    </p>
                                </div>
                            )}

                            {uploadMutation.isError && !isLoading && (
                                <p className='text-destructive mt-2 text-sm'>
                                    {uploadMutation.error?.message ||
                                        'An unknown error occured.'}
                                </p>
                            )}
                            {previewUrl && !uploadMutation.isError && (
                                <div className='mt-4'>
                                    <img
                                        src={previewUrl}
                                        alt='Preview'
                                        className='max-w-xs rounded border'
                                    />
                                    {uploadMutation.isSuccess && !isLoading && (
                                        <p className='mt-1 text-sm text-green-600'>
                                            Upload complete
                                        </p>
                                    )}
                                </div>
                            )}
                            <FormMessage>
                                {form.formState.errors.featuredImageId?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />

                <div className='space-y-2'>
                    <FormLabel htmlFor='tags'>Tags</FormLabel>
                    <div className='mb-2 flex flex-wrap gap-2'>
                        {tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant='secondary'
                                className='px-2 py-1'
                            >
                                {tag.text}
                                <button
                                    type='button'
                                    onClick={() => handleTagDelete(tag)}
                                    className='hover:bg-muted ml-1 rounded-full p-1 text-xs'
                                >
                                    <X size={12} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className='flex'>
                        <Input
                            id='tags'
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={handleTagAddition}
                            placeholder='Add tags (press Enter or comma to add)'
                            className='flex-grow'
                        />
                    </div>
                    <p className='text-muted-foreground text-xs'>
                        Press Enter or comma to add a tag
                    </p>
                </div>

                <div className='space-y-2'>
                    <FormLabel htmlFor='content'>Content</FormLabel>
                    <div className='min-h-[200px] rounded-md border'>
                        <ReactQuill
                            id='content'
                            theme='snow'
                            value={contents}
                            onChange={setContents}
                            modules={modules}
                            placeholder='Write your blog content here...'
                            className='mb-10 h-[200px]'
                        />
                    </div>
                    {/* {!contents && (
                    <p className='text-destructive text-sm'>
                        Content is required
                    </p>
                )} */}
                </div>

                {/* {form.formState.errors.root && (
                <p className='text-destructive text-sm font-medium'>
                    {form.formState.errors.root.message}
                </p>
            )} */}

                <div className='flex justify-end gap-2 pt-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            form.reset()
                            setTags([])
                            setContents('')
                            setIsModalOpen(false)
                        }}
                        disabled={createPostMutation.isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type='submit'
                        disabled={
                            !form.getValues().title ||
                            !contents ||
                            createPostMutation.isPending
                        }
                    >
                        {createPostMutation.isPending
                            ? 'Creating...'
                            : 'Create'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

CreatePostForm.propTypes = {
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
    setIsModalOpen: PropTypes.func,
}
