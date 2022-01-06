import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './components/layout/Landing'
import Auth from './views/Auth'
import Dashboard from './views/Dashboard'
import AuthContextProvider from './contexts/AuthContext'
import ProtectedRoute from './components/routing/ProtectedRoute'

const App = () => {
    return (
        <AuthContextProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Auth authRoute='login' />} />
                    <Route path='/register' element={<Auth authRoute='register' />} />
                    <Route path='/dashboard' element={
                        <ProtectedRoute redirecTo='/login'>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthContextProvider>
    )
}

export default App
