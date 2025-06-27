import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TopBar.css';

interface TopBarProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ showSignOut, onSignOut }) => {
  const location = useLocation();

  useEffect(() => {
    // Inject Google Analytics script only once
    if (!document.getElementById('ga-gtag-script')) {
      const script1 = document.createElement('script');
      script1.id = 'ga-gtag-script';
      script1.async = true;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-5E61JKKBJ8';
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5E61JKKBJ8');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  // Google Analytics pageview tracking
  useEffect(() => {
    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location]);

  // Helper to get formatted user name
  const getFormattedUserName = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.first_name) {
          const name = user.first_name;
          return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return null;
  };

  const formattedName = getFormattedUserName();

  return (
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <span className="navbar-brand-typing">Typing</span>
            <span className="navbar-brand-genie">Genie</span>
          </Link>
        </div>
        {/* Only show navbar-right if showSignOut is not true */}
        <div className="navbar-right">
        {showSignOut ? (
          <>
            {formattedName && (
              <div style={{ marginTop: '0.1em', float: 'right', marginRight: 16 }}>
                <span className="nf-nav-separator">Hi {formattedName}!</span>
              </div>
            )}
            <Link to="/" className="navbar-link login" onClick={e => {
              e.preventDefault();
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              if (onSignOut) onSignOut();
              window.location.reload(); // ensure UI updates to logged out mode
            }}>Sign Out</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link login">Login</Link> &nbsp; &nbsp;
            <Link to="/signup" className="navbar-link signup">Sign Up</Link>
          </>
        )}
        </div>
      </nav>
  );
};

export default TopBar;
