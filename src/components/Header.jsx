import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'

export function Header() {
    const [token, setToken] = useAuth()
    if (token) {
        const { sub } = jwtDecode(token)
        return (
            <div className='header-container'>
                Logged in as <User id={sub} />
                <button className='button' onClick={() => setToken(null)}>
                    Logout
                </button>
            </div>
        )
    }
    return (
        <div className='link-container'>
            <Link className='link' to={'./login'}>
                Log In
            </Link>{' '}
            |{' '}
            <Link className='link' to='/signup'>
                SignUp
            </Link>
        </div>
    )
}
