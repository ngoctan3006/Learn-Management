import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'
import NavbarMenu from '../layout/NavbarMenu'

const ProtectedRoute = ({ children, redirecTo }) => {
    const { authState: { authLoading, isAuthenticated } } = useContext(AuthContext)
    if (authLoading) {
        return (
            <div className="spinner-container">
                <Spinner animation='border' variant='info' />
            </div>
        )
    }

    return isAuthenticated ? (
        <>
            <NavbarMenu />
            {children}
        </>
    ) : <Navigate to={redirecTo} />
}

export default ProtectedRoute
