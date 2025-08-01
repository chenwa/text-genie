import React from 'react';
import { Link } from 'react-router-dom';
import Messenger from '../components/Messenger';
import { callWriterApi } from '../utils/api_utils';
import translations from './Translations';
export type SupportedLang = 'en' | 'es' | 'zh' | 'de' | 'ru' | 'ja' | 'fr' | 'pt' | 'it' | 'ar' | 'hi' | 'id' | 'ko';

// Fix: import the full translations object from Translations.ts
// and ensure all languages are included and exported.
// If needed, update Translations.ts to export the full object and its type.

type TranslationObject = typeof translations['en'];

type TranslationsType = Record<SupportedLang, TranslationObject>;

const translationsTyped = translations as TranslationsType;

const LANG_STORAGE_KEY = 'typinggenie_lang';
const USER_INPUT_STORAGE_KEY = 'typinggenie_user_input';
const DEMO_OUTPUT_STORAGE_KEY = 'typinggenie_demo_output';
const DOC_TYPE_STORAGE_KEY = 'typinggenie_doc_type';
const TONE_STORAGE_KEY = 'typinggenie_tone';
const REVISE_STORAGE_KEY = 'typinggenie_revise';

const Home: React.FC = () => {
  const [lang, setLang] = React.useState<SupportedLang>(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && ['en','es','zh','de','ru','ja','fr','pt','it','ar','hi','id','ko'].includes(stored)) {
      return stored as SupportedLang;
    }
    return 'en';
  });

  // Listen for language changes from TopBar
  React.useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored && ['en','es','zh','de','ru','ja','fr','pt','it','ar','hi','id','ko'].includes(stored)) {
        setLang(stored as SupportedLang);
      }
    };

    // Listen for storage events and check periodically
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  // State for demo output
  const [demoOutput, setDemoOutput] = React.useState<string>(() => {
    return localStorage.getItem(DEMO_OUTPUT_STORAGE_KEY) || "";
  });
  const [demoLoading, setDemoLoading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(!!localStorage.getItem('token'));
  const [userInput, setUserInput] = React.useState<string>(() => {
    if (localStorage.getItem('token')) {
      return localStorage.getItem(USER_INPUT_STORAGE_KEY) || "";
    }
    return "";
  });
  const [selectedDocType, setSelectedDocType] = React.useState<string>(() => {
    return localStorage.getItem(DOC_TYPE_STORAGE_KEY) || translationsTyped['en'].documentTypeOptions[1];
  });
  const [selectedTone, setSelectedTone] = React.useState<string>(() => {
    return localStorage.getItem(TONE_STORAGE_KEY) || translationsTyped['en'].toneOptions[0];
  });
  const [selectedRevise, setSelectedRevise] = React.useState<string>(() => {
    return localStorage.getItem(REVISE_STORAGE_KEY) || translationsTyped['en'].reviseOptions[2];
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

  // Persist user input only if logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(USER_INPUT_STORAGE_KEY, userInput);
    }
  }, [userInput, isLoggedIn]);

  // Persist demo output
  React.useEffect(() => {
    localStorage.setItem(DEMO_OUTPUT_STORAGE_KEY, demoOutput);
  }, [demoOutput]);

  // Persist selections
  React.useEffect(() => {
    localStorage.setItem(DOC_TYPE_STORAGE_KEY, selectedDocType);
  }, [selectedDocType]);
  React.useEffect(() => {
    localStorage.setItem(TONE_STORAGE_KEY, selectedTone);
  }, [selectedTone]);
  React.useEffect(() => {
    localStorage.setItem(REVISE_STORAGE_KEY, selectedRevise);
  }, [selectedRevise]);

  // Scroll to top on first visit
  React.useEffect(() => {
    if (!localStorage.getItem('typinggenie_home_visited')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      localStorage.setItem('typinggenie_home_visited', '1');
    }
  }, []);

  const handleDemoGenerate = async () => {
    const text = (document.getElementById('user_input') as HTMLTextAreaElement)?.value || '';
    const documentType = selectedDocType;
    const tone = selectedTone;
    const revise = selectedRevise;
    const language = lang;
    if (!text.trim()) {
      setDemoOutput(translations[lang].pleaseEnter);
      return;
    }
    setDemoLoading(true);
    setDemoOutput('');
    try {
      const result = await callWriterApi({ text, documentType, tone, revise, is_logged_in: isLoggedIn, language });
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

  // SEO: Set meta tags dynamically based on language
  React.useEffect(() => {
    const t = translationsTyped[lang];
    document.title = `${t.brandName} – ${t.heroTitle.replace(/—$/, '').trim()}`;
    // Remove any previous meta tags to avoid duplicates
    const prevDesc = document.querySelector('meta[name="description"]');
    if (prevDesc) prevDesc.remove();
    const prevOgTitle = document.querySelector('meta[property="og:title"]');
    if (prevOgTitle) prevOgTitle.remove();
    const prevOgDesc = document.querySelector('meta[property="og:description"]');
    if (prevOgDesc) prevOgDesc.remove();
    const prevOgImage = document.querySelector('meta[property="og:image"]');
    if (prevOgImage) prevOgImage.remove();

    // Add meta description
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = t.heroSubtitle;
    document.head.appendChild(metaDesc);

    // Open Graph tags
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = `${t.brandName} – ${t.heroTitle.replace(/—$/, '').trim()}`;
    document.head.appendChild(ogTitle);

    const ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.content = t.heroSubtitle;
    document.head.appendChild(ogDesc);

    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = '/genie-og.png'; // Use your actual OG image path
    document.head.appendChild(ogImage);

    // Optional: canonical link
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + window.location.pathname);

    // Cleanup on unmount
    return () => {
      [metaDesc, ogTitle, ogDesc, ogImage].forEach(tag => tag.remove());
    };
  }, [lang]);

  return (
    <div className="home-root" style={{ position: 'relative' }}>
      <style>
        {`
          .demo-textarea::placeholder {
            color: #bbb !important;
            opacity: 0.5 !important;
          }
        `}
      </style>
      {/* Progress Bar Overlay - Removed to keep only button spinner */}

      {/* Hero Section */}
      {!isLoggedIn && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {t.heroTitle} <span className="hero-highlight">{t.heroHighlight}</span>
            </h1>
          </div>
          <div className="hero-illustration">
            <div
              className="hero-genie"
              title={t.genieTooltip}
            >
              <span role="img" aria-label="Genie" style={{ fontSize: 200 }}>🧞‍♂️</span>
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
              <em
                style={{
                  color: 'var(--text-muted, #bbb)',
                  ...(document.body.classList.contains('dark-mode') && { color: '#bbb' }),
                }}
              >
                {t.signupEncouragement}
              </em>
            </div>
          </div>
        </section>
      )}

      {/* Demo Section */}
      <section id="demo-section" className="demo-section">
        {!isLoggedIn && (
          <h2 className="demo-title">{t.demoTitle}</h2>
        )}
        {isLoggedIn && (
          <h2 className="demo-title">{t.heroTitle} <span className="hero-highlight">{t.heroHighlight}</span></h2>
        )}
        <div className="demo-desc" style={{ marginLeft: '5px', fontSize: '16px', color: 'var(--text-muted)' }}>{t.heroTagline}</div>
        <textarea
          id="user_input"
          className="demo-textarea"
          placeholder={t.demoPlaceholder}
          style={isLoggedIn ? { height: '270px', border: '1px solid #1976D2' } : { height: '170px', border: '1px solid #1976D2' }}
          value={userInput}
          onChange={e => {
            if (!isLoggedIn && e.target.value.length > 5000) return;
            setUserInput(e.target.value);
          }}
          maxLength={maxChars}
        />
        <div style={{ textAlign: 'right', fontSize: 12, color: userInput.length >= 5000 && !isLoggedIn ? '#e60023' : '#888', margin: '-10px 8px 4px 0' }}>
          {t.characterCountLabel} {userInput.length}{!isLoggedIn}
          {userInput.length >= 5000 && !isLoggedIn && (
            <span style={{ color: '#e60023', marginLeft: 8 }}>
              {t.demoLimit}
            </span>
          )}
        </div>
        <div className="demo-row" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="document_type" style={{ fontWeight: 500, marginRight: 4 }}>{t.documentTypeLabel}</label>
          <select id="document_type" className="demo-select" value={selectedDocType} onChange={e => setSelectedDocType(e.target.value)}>
            <option value="" disabled style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{t.documentTypeLabel}</option>
            {translationsTyped['en'].documentTypeOptions.map((opt: string, idx: number) => (
              <option key={opt} value={opt}>
                {t.documentTypeOptions[idx]}
              </option>
            ))}
          </select>
          <label htmlFor="tone" style={{ fontWeight: 500, marginLeft: 12, marginRight: 4 }}>{t.toneLabel}</label>
          <select id="tone" className="demo-select" value={selectedTone} onChange={e => setSelectedTone(e.target.value)}>
            <option value="" disabled style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{t.toneLabel}</option>
            {translationsTyped['en'].toneOptions.map((opt: string, idx: number) => (
              <option key={opt} value={opt}>
                {t.toneOptions[idx]}
              </option>
            ))}
          </select>
          <label htmlFor="revise" style={{ fontWeight: 500, marginLeft: 12, marginRight: 4 }}>{t.reviseLabel}</label>
          <select id="revise" className="demo-select" value={selectedRevise} onChange={e => setSelectedRevise(e.target.value)}>
            <option value="" disabled style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{t.reviseLabel}</option>
            {translationsTyped['en'].reviseOptions.map((opt: string, idx: number) => (
              <option key={opt} value={opt}>
                {t.reviseOptions[idx]}
              </option>
            ))}
          </select>
          <button
            className="demo-generate-btn"
            onClick={handleDemoGenerate}
            disabled={demoLoading}
            style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8 }}
            title={t.demoGenerateTooltip}
          >
            {demoLoading && (
              <div style={{
                width: 20,
                height: 20,
                border: '3px solid var(--bg-tertiary)',
                borderTop: '3px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
            )}
            {demoLoading ? t.demoGenerating : t.demoGenerate}
          </button>
        </div>
        <div
          className="demo-output"
          style={isLoggedIn ? { minHeight: 400, padding: 5, marginBottom: 20 } : { padding: 5, marginBottom: 10 }}
        >
          {!demoLoading && !demoOutput && (
            <em style={{ color: '#888', fontSize: '0.9rem' }}>{t.demoPolished}</em>
          )}
          {/* This is where the generated text will be displayed */}
          <div style={{ position: 'relative' }}>
            <div
              className="demo-output-text"
              id="demo-output-text"
              style={{ minHeight: 300 }}
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
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -4,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: 16,
                  boxShadow: '0 1px 4px var(--shadow-light)',
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
                    <rect x="6" y="4" width="9" height="12" rx="2" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1.5"/>
                    <rect x="3" y="7" width="9" height="9" rx="2" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1.5"/>
                  </svg>
                )}
                <span style={{ fontSize: 13, color: copied ? '#388e3c' : 'var(--accent-blue)', fontWeight: 500 }}>
                  {copied ? t.demoCopied : t.demoCopy}
                </span>
              </button>
            )}
            <span id="ai-disclaim" style={{ display: 'block', marginTop: 4, color: 'var(--text-muted)', fontSize: 10, textAlign: 'right' }}>{t.genieTooltip}</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ marginBottom: 0, paddingBottom: 0 }}>
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
      <footer className="footer" style={{ marginTop: 0 }}>
        {t.footer} 
        {/* * 
        <Link to="/terms" className="footer-link">{t.terms}</Link> · <Link to="/privacy" className="footer-link">{t.privacy}</Link> · <Link to="/contact" className="footer-link">{t.contact}</Link> 
        */}
      </footer>

      <div style={{ position: 'fixed', bottom: 7, left: 5, zIndex: 1000 }}>  
        <button className="demo-generate-btn" onClick={() => window.open('https://www.buymeacoffee.com/typinggenie', '_blank')} 
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, height: 35 }}>
          <span role="img" aria-label="coffee" style={{ fontSize: 20 }}>☕</span>
          <span>{t.buyMeACoffee || 'Buy Me A Coffee'}</span>
        </button>
      </div>
      <div style={{ position: 'fixed', bottom: 0, right: 24, zIndex: 1000 }}>
        <Messenger isLoggedIn={isLoggedIn} lang={lang} />
      </div>
    </div>
  );
};

export default Home;
