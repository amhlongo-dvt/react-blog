import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/users'
import { useAuth } from '../contexts/AuthContext'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Shadcn UI components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
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
import { DialogDescription } from '../components/ui/dialog'

// Form validation schema
const formSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
})

export function Login({ isLoginModalOpen, setIsLoginModalOpen }) {
    const navigate = useNavigate()
    const [, setToken] = useAuth()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const loginMutation = useMutation({
        mutationFn: (values) => login(values),
        onSuccess: (data) => {
            setToken(data.token)
            navigate('/')
            setIsLoginModalOpen(false)
        },
        onError: () => {
            form.setError('root', {
                message: 'Failed to login! Please check your credentials.',
            })
        },
    })

    function onSubmit(values) {
        console.log(values)

        loginMutation.mutate(values)
    }

    return (
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
            <DialogContent className='max-w-sm'>
                <DialogHeader className='pb-4'>
                    <DialogTitle className='text-2xl font-bold'>
                        Login
                    </DialogTitle>
                    <DialogDescription>
                        Enter your email below to login to your account
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter your username'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder='Enter your password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.formState.errors.root && (
                            <p className='text-destructive text-sm font-medium'>
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <div className='flex justify-end pt-2'>
                            <Button
                                type='submit'
                                disabled={loginMutation.isPending}
                                className='w-full sm:w-auto'
                            >
                                {loginMutation.isPending
                                    ? 'Logging in...'
                                    : 'Log In'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

Login.propTypes = {
    setIsLoginModalOpen: PropTypes.func,
    isLoginModalOpen: PropTypes.bool,
}
