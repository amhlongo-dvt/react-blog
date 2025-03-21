import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users'

export function User({ id }) {
    const userInfoQuery = useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserInfo(id),
    })

    const userInfo = userInfoQuery.data ?? {}
    return <span className='text text--bold'>{userInfo?.username ?? id}</span>
}

User.propTypes = {
    id: PropTypes.string.isRequired,
}
