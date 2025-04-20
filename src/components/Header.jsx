import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'
import { ArrowLeftIcon, CommandIcon, PlusIcon } from 'lucide-react'
import PropTypes from 'prop-types'

// Shadcn UI components
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ModeToggle } from './DarkModeToggle'
import { Link } from 'react-router-dom'

export function Header({
    setIsModalOpen,
    setIsLoginModalOpen,
    setIsSignUpModalOpen,
    isPost,
}) {
    const [token, setToken] = useAuth()
    let sub = ''

    if (token) {
        try {
            const decoded = jwtDecode(token)
            sub = decoded.sub || decoded.subject || ''
        } catch (e) {
            sub = ''
        }
    }
    if (!isPost) {
        return (
            <header className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <CommandIcon className='h-5 w-5' />
                    <h1 className='text-xl font-bold'>Syntax</h1>
                </div>

                {token && (
                    <>
                        <div className='flex items-center gap-2'>
                            {/* Fixed Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <User id={sub} oneLetter />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <div className='px-2 py-1.5'>
                                        <p className='text-sm font-medium'>
                                            <User id={sub} />
                                        </p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setToken(null)}
                                        className='text-destructive focus:text-destructive'
                                    >
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ModeToggle />
                        </div>

                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-primary fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full p-0 shadow-lg hover:bg-purple-700 md:hidden'
                            size='icon'
                        >
                            <PlusIcon className='h-12 w-12' />
                            <span className='sr-only'>Create new post</span>
                        </Button>
                    </>
                )}

                {!token && (
                    <div className='flex items-center gap-2'>
                        <div className='md:hidden'>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => setIsLoginModalOpen(true)}
                            >
                                Log In
                            </Button>

                            <Button
                                size='sm'
                                onClick={() => setIsSignUpModalOpen(true)}
                            >
                                Sign Up
                            </Button>
                        </div>
                        <ModeToggle />
                    </div>
                )}
            </header>
        )
    }

    return (
        <header className='bg-background sticky top-0 z-30 flex items-center justify-between px-2 py-2'>
            <Link
                to='/'
                className='hover:text-primary flex w-max items-center font-semibold'
            >
                <ArrowLeftIcon className='size-5' strokeWidth={3} />
                Back
            </Link>
            <div className='flex items-center gap-2'>
                <CommandIcon className='h-5 w-5' />
                <h1 className='text-xl font-bold'>Syntax</h1>
            </div>
            <ModeToggle />
        </header>
    )
}

Header.propTypes = {
    setIsModalOpen: PropTypes.func,
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
    isPost: PropTypes.bool,
}
