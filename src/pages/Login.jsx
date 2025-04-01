import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/users'
import { useAuth } from '../contexts/AuthContext'
import PropTypes from 'prop-types'

export function Login({ isLoginModalOpen, setIsLoginModalOpen }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const [, setToken] = useAuth()

    const loginMutation = useMutation({
        mutationFn: () => login({ username, password }),
        onSuccess: (data) => {
            setToken(data.token)
            navigate('/')
        },
        onError: () => alert('failed to login!'),
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        loginMutation.mutate()
    }

    return (
        <div className='flex items-center justify-center'>
            {isLoginModalOpen && (
                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div className='flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                        {/* Background Overlay */}
                        <div
                            className='fixed inset-0 transition-opacity'
                            aria-hidden='true'
                            onClick={() => setIsLoginModalOpen(false)}
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
                                Welcome Back!!!
                            </h3>
                            <form
                                onSubmit={handleSubmit}
                                className='form space-y-6'
                            >
                                <div>
                                    <label
                                        htmlFor='create-username'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Username
                                    </label>
                                    <input
                                        className='mt-1 block w-full rounded-md border border-gray-300 px-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-0'
                                        type='text'
                                        name='create-username'
                                        id='create-username'
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor='create-password'
                                        className='block text-sm font-medium text-gray-700'
                                    >
                                        Password
                                    </label>
                                    <input
                                        className='mt-1 block w-full rounded-md border border-gray-300 px-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-0'
                                        type='password'
                                        name='create-password'
                                        id='create-password'
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className='flex justify-end space-x-4'>
                                    <input
                                        className='rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300'
                                        type='submit'
                                        value={
                                            loginMutation.isPending
                                                ? 'Logging in...'
                                                : 'Log In'
                                        }
                                        disabled={
                                            !username ||
                                            !password ||
                                            loginMutation.isPending
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

Login.propTypes = {
    setIsLoginModalOpen: PropTypes.func,
    isLoginModalOpen: PropTypes.bool,
}
