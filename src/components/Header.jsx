import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'
import { CommandIcon, PlusIcon } from 'lucide-react'
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

export function Header({
    setIsModalOpen,
    setIsLoginModalOpen,
    setIsSignUpModalOpen,
}) {
    const [token, setToken] = useAuth()

    if (token) {
        const { sub } = jwtDecode(token)

        return (
            <header className='flex items-center justify-between pt-4'>
                <div className='flex items-center gap-2'>
                    <CommandIcon className='h-5 w-5' />
                    <h1 className='text-xl font-bold'>Syntax</h1>
                </div>

                <div className='flex items-center gap-2'>
                    {/* Fixed Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {/* Simple button instead of asChild for compatibility */}
                            <button className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-300'>
                                <User id={sub} oneLetter />
                            </button>
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
                </div>

                {/* Floating Action Button */}
                <Button
                    onClick={() => setIsModalOpen(true)}
                    className='fixed right-6 bottom-6 z-50 h-12 w-12 rounded-full bg-amber-700 p-0 shadow-lg hover:bg-amber-800'
                    size='icon'
                >
                    <PlusIcon className='h-12 w-12' />
                    <span className='sr-only'>Create new post</span>
                </Button>
            </header>
        )
    }

    return (
        <header className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
                <CommandIcon className='h-5 w-5' />
                <h1 className='text-xl font-bold'>Syntax</h1>
            </div>

            <div className='flex items-center gap-2'>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsLoginModalOpen(true)}
                >
                    Log In
                </Button>

                <Button size='sm' onClick={() => setIsSignUpModalOpen(true)}>
                    Sign Up
                </Button>
                <ModeToggle />
            </div>
        </header>
    )
}

Header.propTypes = {
    setIsModalOpen: PropTypes.func,
    setIsLoginModalOpen: PropTypes.func,
    setIsSignUpModalOpen: PropTypes.func,
}
