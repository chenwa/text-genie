import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-84FGET7M7G';
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-84FGET7M7G');
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
        <div className="navbar-right" style={{ position: 'relative', right: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        {showSignOut ? (
          <>
            {formattedName && (
              <div style={{ marginTop: '0.1em', float: 'right' }}>
                <span className="nf-nav-separator">Hi {formattedName}!</span>
              </div>
            )}
            <Link to="/" className="navbar-link login" onClick={e => {
              e.preventDefault();
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              // Clear all TypingGenie app state
              localStorage.removeItem('typinggenie_lang');
              localStorage.removeItem('typinggenie_user_input');
              localStorage.removeItem('typinggenie_demo_output');
              localStorage.removeItem('typinggenie_doc_type');
              localStorage.removeItem('typinggenie_tone');
              localStorage.removeItem('typinggenie_revise');
              localStorage.removeItem('typinggenie_messenger_history');
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
