import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const ProtectedRoute = () => {
    const { user, loading, isAdmin } = useAuth()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (isAdmin === false) {
        return <Navigate to="/login" replace state={{ message: 'Acesso restrito a administradores.' }} />
    }

    if (isAdmin === null) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return <Outlet />
}
