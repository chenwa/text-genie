import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import translations from '../pages/Translations';
import type { SupportedLang } from '../pages/Home';

interface TopBarProps {
  showSignOut?: boolean;
  onSignOut?: () => void;
  lang?: SupportedLang;
}

const TopBar: React.FC<TopBarProps> = ({ showSignOut, onSignOut, lang: propLang }) => {
  const location = useLocation();
  
  // State to track current language, with fallback to localStorage
  const [currentLang, setCurrentLang] = useState<SupportedLang>(() => {
    if (propLang) return propLang;
    const stored = localStorage.getItem('typinggenie_lang');
    if (stored && ['en','es','zh','de','ru','ja','fr','pt','it','ar','hi','id','ko'].includes(stored)) {
      return stored as SupportedLang;
    }
    return 'en';
  });

  // Listen for localStorage changes to update language
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('typinggenie_lang');
      if (stored && ['en','es','zh','de','ru','ja','fr','pt','it','ar','hi','id','ko'].includes(stored)) {
        setCurrentLang(stored as SupportedLang);
      }
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for changes (in case the storage event doesn't fire)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Update current language if prop changes
  useEffect(() => {
    if (propLang) {
      setCurrentLang(propLang);
    }
  }, [propLang]);

  const t = translations[currentLang];

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
        {/* Language Selector */}
        <ThemeToggle />&nbsp;
        <select
          value={currentLang}
          onChange={e => {
            const newLang = e.target.value as SupportedLang;
            setCurrentLang(newLang);
            localStorage.setItem('typinggenie_lang', newLang);
          }}
          style={{
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            fontWeight: 600,
            fontSize: 14,
            background: 'var(--bg-secondary)',
            color: 'var(--accent-blue)',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 1px 4px var(--shadow-light)',
            maxWidth: 120,
            minWidth: 80
          }}
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="zh">中文</option>
          <option value="de">Deutsch</option>
          <option value="ru">Русский</option>
          <option value="ja">日本語</option>
          <option value="fr">Français</option>
          <option value="pt">Português</option>
          <option value="it">Italiano</option>
          <option value="ar">العربية</option>
          <option value="hi">हिन्दी</option>
          <option value="id">Indonesia</option>
          <option value="ko">한국어</option>
        </select>&nbsp;
        {showSignOut ? (
          <>
            {formattedName && (
              <div style={{ marginTop: '0.1em', float: 'right' }}>
                <span className="nf-nav-separator">Hi {formattedName}!&nbsp;</span>
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
            }}>{t.signOut}</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link login">{t.login}</Link> &nbsp;
            <Link to="/signup" className="navbar-link signup">{t.signUp}</Link>
          </>
        )}
        </div>
      </nav>
  );
};

export default TopBar;
