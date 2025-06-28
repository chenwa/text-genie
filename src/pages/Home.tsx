import React from 'react';
import { Link } from 'react-router-dom';
import Messenger from '../components/Messenger';
import { callWriterApi } from '../api/api_utils';
import translations from './Translations';
export type SupportedLang = 'en' | 'es' | 'zh' | 'de' | 'ru' | 'ja' | 'fr' | 'pt' | 'it' | 'ar' | 'hi' | 'id';

// Fix: import the full translations object from Translations.ts
// and ensure all languages are included and exported.
// If needed, update Translations.ts to export the full object and its type.

type TranslationObject = typeof translations['en'];

type TranslationsType = Record<SupportedLang, TranslationObject>;

const translationsTyped = translations as TranslationsType;

const LANG_STORAGE_KEY = 'typinggenie_lang';
const USER_INPUT_STORAGE_KEY = 'typinggenie_user_input';
const DEMO_OUTPUT_STORAGE_KEY = 'typinggenie_demo_output';

const Home: React.FC = () => {
  const [lang, setLang] = React.useState<SupportedLang>(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && ['en','es','zh','de','ru','ja','fr','pt','it','ar','hi','id'].includes(stored)) {
      return stored as SupportedLang;
    }
    return 'en';
  });
  // State for demo output
  const [demoOutput, setDemoOutput] = React.useState<string>(() => {
    return localStorage.getItem(DEMO_OUTPUT_STORAGE_KEY) || "";
  });
  const [demoLoading, setDemoLoading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(!!localStorage.getItem('token'));
  const [userInput, setUserInput] = React.useState<string>(() => {
    return localStorage.getItem(USER_INPUT_STORAGE_KEY) || "";
  });

  React.useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Persist language selection
  React.useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  // Persist user input
  React.useEffect(() => {
    localStorage.setItem(USER_INPUT_STORAGE_KEY, userInput);
  }, [userInput]);

  // Persist demo output
  React.useEffect(() => {
    localStorage.setItem(DEMO_OUTPUT_STORAGE_KEY, demoOutput);
  }, [demoOutput]);

  const handleDemoGenerate = async () => {
    const text = (document.getElementById('user_input') as HTMLTextAreaElement)?.value || '';
    const documentType = (document.getElementById('document_type') as HTMLSelectElement)?.value || '';
    const tone = (document.getElementById('tone') as HTMLSelectElement)?.value || '';
    const revise = (document.getElementById('revise') as HTMLSelectElement)?.value || '';
    if (!text.trim()) {
      setDemoOutput(translations[lang].pleaseEnter);
      return;
    }
    setDemoLoading(true);
    setDemoOutput('');
    try {
      const result = await callWriterApi({ text, documentType, tone, revise, is_logged_in: isLoggedIn });
      setDemoOutput(result);
    } catch (e) {
      setDemoOutput(translations[lang].sorryProblem);
    } finally {
      setDemoLoading(false);
    }
  };

  const maxChars = isLoggedIn ? undefined : 5000;

  // Add type assertions for translations
  const t = translationsTyped[lang];

  return (
    <div className="home-root" style={{ position: 'relative' }}>
      {/* Language Selector */}
      <div style={{ position: 'absolute', top: 8, right: 20, zIndex: 3000 }}>
        <select
          value={lang}
          onChange={e => setLang(e.target.value as SupportedLang)}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #bbb',
            fontWeight: 600,
            fontSize: 15,
            background: '#fff',
            color: '#1976d2',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
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
          <option value="id">Bahasa Indonesia</option>
        </select>
      </div>

      {/* Progress Bar Overlay */}
      {demoLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(255,255,255,0.6)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            <div className="loader" style={{
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #1976d2',
              borderRadius: '50%',
              width: 60,
              height: 60,
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 20 }}>{t.demoGenerating}</div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {!isLoggedIn && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {t.heroTitle} <span className="hero-highlight" style={{ whiteSpace: 'nowrap' }}>{t.heroHighlight}</span>
            </h1>
          </div>
          <div className="hero-illustration">
            <div className="hero-genie">
              <span role="img" aria-label="Genie" style={{ fontSize: 240 }}>🧞‍♂️</span>
            </div>
          </div>
          <div className="hero-content">
            <p className="hero-subtitle">
              {t.heroSubtitle}
            </p>
            <div className="hero-cta-row">
              <Link to="/signup" className="hero-signup-btn">{t.heroCta}</Link>
            </div>
            <div className="hero-tagline">
              <em>{t.heroTagline}</em>
            </div>
          </div>
        </section>
      )}

      {/* Live Section */}
      <section id="demo-section" className="demo-section">
        {!isLoggedIn && (
          <h2 className="demo-title">{t.demoTitle}</h2>
        )}
        <div className="demo-desc">{t.demoDesc}</div>
        <textarea
          id="user_input"
          className="demo-textarea"
          placeholder={t.demoPlaceholder}
          style={isLoggedIn ? { height: '270px' } : { height: '170px' }}
          value={userInput}
          onChange={e => {
            if (!isLoggedIn && e.target.value.length > 5000) return;
            setUserInput(e.target.value);
          }}
          maxLength={maxChars}
        />
        <div style={{ textAlign: 'right', fontSize: 13, color: userInput.length >= 5000 && !isLoggedIn ? '#e60023' : '#888', margin: '-10px 8px 4px 0' }}>
          Character {userInput.length}{!isLoggedIn}
          {userInput.length >= 5000 && !isLoggedIn && (
            <span style={{ color: '#e60023', marginLeft: 8 }}>
              {t.demoLimit}
            </span>
          )}
        </div>
        <div className="demo-row" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="document_type" style={{ fontWeight: 500, marginRight: 4 }}>{t.documentTypeLabel}</label>
          <select id="document_type" className="demo-select" defaultValue={t.documentTypeOptions[1]}>
            {t.documentTypeOptions.map((opt: string) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <label htmlFor="tone" style={{ fontWeight: 500, marginLeft: 12, marginRight: 4 }}>{t.toneLabel}</label>
          <select id="tone" className="demo-select" defaultValue={t.toneOptions[0]}>
            {t.toneOptions.map((opt: string) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <label htmlFor="revise" style={{ fontWeight: 500, marginLeft: 12, marginRight: 4 }}>{t.reviseLabel}</label>
          <select id="revise" className="demo-select" defaultValue={t.reviseOptions[2]}>
            {t.reviseOptions.map((opt: string) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <button
            className="demo-generate-btn"
            onClick={handleDemoGenerate}
            disabled={demoLoading}
            style={{ marginLeft: 12 }}
            title="Let TypingGenie craft your perfect text!"
          >
            {demoLoading ? t.demoGenerating : t.demoGenerate}
          </button>
        </div>
        <div
          className="demo-output"
          style={isLoggedIn ? { minHeight: 400, padding: 5, marginBottom: 20 } : { padding: 5, marginBottom: 20 }}
        >
          {!demoLoading && !demoOutput && (
            <em>{t.demoPolished}</em>
          )}
          {/* This is where the generated text will be displayed */}
          <div style={{ position: 'relative' }}>
            <div
              className="demo-output-text"
              id="demo-output-text"
              dangerouslySetInnerHTML={{ __html: demoOutput }}
            />
            {demoOutput && (
              <button
                onClick={() => {
                  const el = document.getElementById('demo-output-text');
                  if (el) {
                    const text = el.innerText;
                    navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }
                }}
                title="Copy to clipboard"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? (
                  <span role="img" aria-label="Copied">✅</span>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                    <rect x="6" y="4" width="9" height="12" rx="2" fill="#fff" stroke="#1976d2" strokeWidth="1.5"/>
                    <rect x="3" y="7" width="9" height="9" rx="2" fill="#fff" stroke="#1976d2" strokeWidth="1.5"/>
                  </svg>
                )}
                <span style={{ fontSize: 13, color: copied ? '#388e3c' : '#1976d2', fontWeight: 500 }}>
                  {copied ? t.demoCopied : t.demoCopy}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        {t.features.slice(0, -1).map((feature: { title: string; desc: string }, index: number) => (
          <div key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
        <div>
          <h3>{t.features[t.features.length - 1].title}</h3>
          <ol className="how-list">
            {t.features[t.features.length - 1].list?.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {t.footer} · <Link to="/terms" className="footer-link">{t.terms}</Link> · <Link to="/privacy" className="footer-link">{t.privacy}</Link> · <Link to="/contact" className="footer-link">{t.contact}</Link>
      </footer>

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Messenger />
      </div>
    </div>
  );
};

export default Home;
