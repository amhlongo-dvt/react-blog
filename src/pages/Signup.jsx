import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/users'
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
    username: z
        .string()
        .min(3, { message: 'Username must be at least 3 characters' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
})

export function Signup({ isSignUpModalOpen, setIsSignUpModalOpen }) {
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const signupMutation = useMutation({
        mutationFn: (values) => signup(values),
        onSuccess: () => {
            navigate('/')
            setIsSignUpModalOpen(false)
        },
        onError: () => {
            form.setError('root', {
                message: 'Failed to sign up! Username may already be taken.',
            })
        },
    })

    function onSubmit(values) {
        signupMutation.mutate(values)
    }

    return (
        <Dialog open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen}>
            <DialogContent className='max-w-sm'>
                <DialogHeader className='pb-4'>
                    <DialogTitle className='text-2xl font-bold'>
                        Sign Up
                    </DialogTitle>
                    <DialogDescription>
                        Enter your email below to sign up to your account
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
                                            placeholder='Choose a username'
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
                                            placeholder='Create a secure password'
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
                                disabled={signupMutation.isPending}
                                className='w-full sm:w-auto'
                            >
                                {signupMutation.isPending
                                    ? 'Signing up...'
                                    : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

Signup.propTypes = {
    setIsSignUpModalOpen: PropTypes.func,
    isSignUpModalOpen: PropTypes.bool,
}
