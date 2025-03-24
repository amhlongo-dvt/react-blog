import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'
import { useState } from 'react'
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/react/16/solid'
export function Header() {
    const [token, setToken] = useAuth()
    const [toggleLogout, setToggleLogout] = useState(false)
    if (token) {
        const { sub } = jwtDecode(token)
        return (
            <div className='header-container flex items-center gap-2'>
                <UserCircleIcon className='size-6' />
                <button
                    className='text cursor-pointer font-semibold hover:text-gray-500'
                    onClick={() => {
                        setToggleLogout(!toggleLogout)
                    }}
                >
                    <User id={sub} />
                </button>
                {toggleLogout && (
                    <button
                        className='button button--danger rounded-sm bg-red-700 px-2 py-0.5 text-white'
                        onClick={() => setToken(null)}
                    >
                        Logout
                    </button>
                )}
                <button className='cursor-pointer rounded-sm bg-gray-950 p-1 hover:bg-gray-500'>
                    <PencilSquareIcon className='size-5 text-yellow-50' />
                </button>
            </div>
        )
    }
    return (
        <div className='link-container flex gap-1'>
            <Link
                className='link rounded-sm bg-gray-500 px-2 py-0.5 text-white'
                to={'./login'}
            >
                Log In
            </Link>
            <Link
                className='link rounded-sm bg-gray-700 px-2 py-0.5 text-white'
                to='/signup'
            >
                SignUp
            </Link>
        </div>
    )
}
