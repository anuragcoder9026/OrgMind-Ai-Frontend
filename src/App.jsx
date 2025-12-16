import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
                        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
                        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

export default App;
