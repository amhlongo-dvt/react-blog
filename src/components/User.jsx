import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users'

export function User({ id, oneLetter = false }) {
    const userInfoQuery = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
    })

    const userInfo = userInfoQuery.data ?? {}
    if (oneLetter) {
        return (
            <span className='text text--bold'>
                {userInfo?.username.charAt(0) ?? 'A'}
            </span>
        )
    }
    return <span className='text text--bold'>{userInfo?.username ?? id}</span>
}

User.propTypes = {
    id: PropTypes.string.isRequired,
    oneLetter: PropTypes.bool,
}
