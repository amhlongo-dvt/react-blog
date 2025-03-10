import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { User } from './User'

export function Header() {
    const [token, setToken] = useAuth()
    if (token) {
        const { sub } = jwtDecode(token)
        return (
            <div>
                Logged in as <User id={sub} />
                <br />
                <button onClick={() => setToken(null)}>Logout</button>
            </div>
        )
    }
    return (
        <div>
            <Link to={'./login'}>Log In</Link> |{' '}
            <Link to='/signup'>SignUp</Link>
        </div>
    )
}
