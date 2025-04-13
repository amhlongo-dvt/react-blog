import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Blog } from './pages/Blog.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'
import '../node_modules/react-quill/dist/quill.snow.css'
import './App.css'
import { ViewPost } from './pages/ViewPost.jsx'
import { ThemeProvider } from './contexts/theme-provider.jsx'
import { Toaster } from './components/ui/sonner.jsx'
const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: '/',
        element: <Blog />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/login',
        element: <Login />,
    },

    {
        path: '/posts/:postId',
        element: <ViewPost />,
    },
])

export function App() {
    return (
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <QueryClientProvider client={queryClient}>
                <AuthContextProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                </AuthContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}
