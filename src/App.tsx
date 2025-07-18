import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TopBar from './components/TopBar';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact'; // Import the Contact page
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from "./context/LanguageContext";

// Create a new component to be able to use hooks
const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/');
    };

    const isLoggedIn = Boolean(
        localStorage.getItem('token') || sessionStorage.getItem('token')
    );

    return (
        <>
            <TopBar showSignOut={isLoggedIn} onSignOut={handleSignOut} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} /> {/* Add the Contact route */}
            </Routes>
        </>
    );
};

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <Router>
                    <AppContent />
                </Router>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
