import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'
import { useState } from 'react'
import { PencilIcon } from '@heroicons/react/16/solid'
import PropTypes from 'prop-types'
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
            <div className='header-container flex items-center gap-2'>
                <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-300'>
                    <button
                        className='font-medium text-gray-600'
                        onClick={() => {
                            setToggleLogout(!toggleLogout)
                        }}
                    >
                        <User id={sub} oneLetter />
                    </button>
                </div>
                <button
                    className='text cursor-pointer font-semibold hover:text-gray-500'
                    onClick={() => {
                        setToggleLogout(!toggleLogout)
                    }}
                >
                    {/* <User id={sub} /> */}
                </button>
                {toggleLogout && (
                    <button
                        className='button button--danger cursor-pointer rounded-sm bg-red-700 px-2 py-1 text-white'
                        onClick={() => setToken(null)}
                    >
                        Logout
                    </button>
                )}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='flex cursor-pointer items-center justify-center gap-1 rounded-sm bg-gray-900 px-2 py-1 font-semibold hover:bg-gray-500'
                >
                    <PencilIcon className='size-4 text-yellow-50' />
                    <p className='text-amber-50'>Post</p>
                </button>
            </div>
        )
    }
    return (
        <div className='link-container flex gap-1'>
            <button
                className='link rounded-sm bg-gray-500 px-2 py-0.5 text-sm font-semibold text-white'
                onClick={() => {
                    setIsLoginModalOpen(true)
                }}
            >
                Log In
            </button>
            <button
                className='link rounded-sm bg-gray-700 px-2 py-0.5 text-sm font-bold text-white'
                onClick={() => {
                    setIsSignUpModalOpen(true)
                }}
            >
                SignUp
            </button>
        </div>
    )
}

Header.propTypes = {
    setIsModalOpen: PropTypes.func,
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
}
