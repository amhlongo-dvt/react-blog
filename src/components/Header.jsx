import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'
import { useState } from 'react'
import { CommandLineIcon, PlusIcon } from '@heroicons/react/16/solid'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'

export function Header({
    setIsModalOpen,
    setIsLoginModalOpen,
    setIsSignUpModalOpen,
}) {
    const [token, setToken] = useAuth()
    const [toggleLogout, setToggleLogout] = useState(false)
    if (token) {
        const { sub } = jwtDecode(token)
        return (
            <div className='mt-4 flex items-center justify-between rounded-lg'>
                <div className='flex items-center'>
                    <CommandLineIcon className='size-6' />
                    <p className='logo-name text-xl font-bold text-gray-950'>
                        Syntax
                    </p>
                </div>
                <div className='header-container flex items-center gap-2'>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-700'
                    >
                        <PlusIcon className='size-6 text-yellow-50' />
                        {/* <p className='text-amber-50'>Post</p> */}
                    </button>
                    <button
                        className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-300'
                        onClick={() => {
                            setToggleLogout(!toggleLogout)
                        }}
                    >
                        <span className='font-medium text-gray-600'>
                            <User id={sub} oneLetter />
                        </span>
                    </button>

                    {toggleLogout && (
                        <Button
                            className='button button--danger cursor-pointer rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white'
                            onClick={() => setToken(null)}
                        >
                            Log Out
                        </Button>
                    )}
                </div>
            </div>
        )
    }
    return (
        <div className='mt-4 flex items-center justify-between rounded-lg'>
            <div className='flex items-center'>
                <CommandLineIcon className='size-6' />
                <p className='logo-name text-xl font-bold text-gray-950'>
                    Syntax
                </p>
            </div>
            <div className='link-container flex gap-1'>
                <Button
                    // className='link rounded-sm bg-gray-500 px-4 py-2 text-sm font-medium text-white'

                    onClick={() => {
                        setIsLoginModalOpen(true)
                    }}
                    variant='ghost'
                    size='sm'
                >
                    Log In
                </Button>

                <Button
                    // className='link rounded-sm bg-gray-700 px-4 py-2 text-sm font-medium text-white'
                    onClick={() => {
                        setIsSignUpModalOpen(true)
                    }}
                    size='sm'
                >
                    Sign Up
                </Button>
            </div>
        </div>
    )
}

Header.propTypes = {
    setIsModalOpen: PropTypes.func,
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
}
