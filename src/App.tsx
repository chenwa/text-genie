import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TopBar from './components/TopBar';
import './App.css';

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
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
