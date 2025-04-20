import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

export function User({ id, oneLetter = false }) {
    const userInfoQuery = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })

    // Handle loading state
    if (userInfoQuery.isLoading) {
        return oneLetter ? (
            <Skeleton className='h-8 w-8 rounded-full' />
        ) : (
            <Skeleton className='h-5 w-20' />
        )
    }

    // Handle error state
    if (userInfoQuery.isError) {
        return <span className='text-muted-foreground'>{id}</span>
    }

    const username = userInfoQuery.data?.username

    // If username is undefined, use fallback
    if (!username) {
        return <span className='text-muted-foreground'>{id}</span>
    }

    // Render user avatar for one letter mode
    if (oneLetter) {
        return (
            <Avatar>
                <AvatarFallback className='bg-primary text-primary-foreground h-8'>
                    {username.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        )
    }

    // Render full username
    return <span className='text-foreground font-medium'>{username}</span>
}

User.propTypes = {
    id: PropTypes.string.isRequired,
    oneLetter: PropTypes.bool,
}
