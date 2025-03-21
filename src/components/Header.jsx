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
                <p className='text'>
                    Logged in as <User id={sub} />
                </p>
                <button
                    className='button button--danger'
                    onClick={() => setToken(null)}
                >
                    Logout
                </button>
            </div>
        )
    }
    return (
        <div className='link-container'>
            <Link className='link text-3xl text-blue-700' to={'./login'}>
                Log In
            </Link>{' '}
            |{' '}
            <Link className='link text-3xl' to='/signup'>
                SignUp
            </Link>
        </div>
    )
}
