import React from 'react';
import { Link } from 'react-router-dom';
import Messenger from '../components/Messenger';
import { callWriterApi } from '../api/api';

const Home: React.FC = () => {
  // State for demo output
  const [demoOutput, setDemoOutput] = React.useState<string>("");
  const [demoLoading, setDemoLoading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(!!localStorage.getItem('token'));

  React.useEffect(() => {
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleDemoGenerate = async () => {
    const text = (document.getElementById('user_input') as HTMLTextAreaElement)?.value || '';
    const documentType = (document.getElementById('document_type') as HTMLSelectElement)?.value || '';
    const tone = (document.getElementById('tone') as HTMLSelectElement)?.value || '';
    if (!text.trim()) {
      setDemoOutput('Please enter what you need help writing.');
      return;
    }
    setDemoLoading(true);
    setDemoOutput('');
    try {
      const result = await callWriterApi({ text, documentType, tone });
      setDemoOutput(result);
    } catch (e) {
      setDemoOutput('Sorry, there was a problem generating your text.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="home-root" style={{ position: 'relative' }}>
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
            <div style={{ fontWeight: 600, color: '#1976d2', fontSize: 20 }}>Generating...</div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {!isLoggedIn && (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Personal Writing Assistant — <span className="hero-highlight" style={{ whiteSpace: 'nowrap' }}>Powered by AI Magic</span>
            </h1>
          </div>
          <div className="hero-illustration">
            <div className="hero-genie">
              <span role="img" aria-label="Genie" style={{ fontSize: 240 }}>🧞‍♂️</span>
            </div>
          </div>
          <div className="hero-content">
            <p className="hero-subtitle">
              Write emails, reports, and docs with clarity and confidence. 
              Typing Genie helps you go from idea to polished text in seconds.
            </p>
            <div className="hero-cta-row">
              <Link to="/signup" className="hero-signup-btn">Sign Up for Free</Link>
            </div>
            <div className="hero-tagline">
              <em>“Just type your idea. We'll handle the words.”</em>
            </div>
          </div>
        </section>
      )}

      {/* Live Section */}
      <section id="demo-section" className="demo-section">
        {!isLoggedIn && (
          <h2 className="demo-title">✨ Try Typing Genie Demo</h2>
        )}
        <div className="demo-desc">💬 Describe what you need help writing…</div>
        <textarea
          id="user_input"
          className="demo-textarea"
          placeholder='e.g. "Tell my boss I need to take Friday off for a family emergency."'
          style={isLoggedIn ? { height: '270px' } : {}}
        />
        <div className="demo-row">
          <select id="document_type" className="demo-select" defaultValue="Formal Email">
            <option>Formal Email</option>
            <option>Friendly Note</option>
            <option>Summary</option>
            <option>Business Proposal</option>
            <option>Report/Review</option>
            <option>Invitation</option>
            <option>Announcement</option>
            <option>Complaint</option>
            <option>Apology</option>
            <option>Story</option>
            <option>Poem</option>
          </select>
          <select id="tone" className="demo-select" defaultValue="Neutral">
            <option>Neutral</option>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Confident</option>
            <option>Encouraging</option>
            <option>Assertive</option>
            <option>Empathetic</option>
            <option>Apologetic</option>
            <option>Optimistic</option>
            <option>Persuasive</option>
            <option>Passionate</option>
            <option>Romantic</option>
            <option>Angry</option>
          </select>
          <button className="demo-generate-btn" onClick={handleDemoGenerate} disabled={demoLoading}>
            {demoLoading ? 'Generating...' : '➤ Generate Text'}
          </button>
        </div>
        <div className="demo-output">
          {!demoLoading && !demoOutput && (
            <em>✨ Polished response will appear here</em>
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
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div>
          <h3>🧠 AI That Understands You</h3>
          <p>Your tone, purpose, and voice — all fine-tuned automatically.</p>
        </div>
        <div>
          <h3>✉️ Professional Emails</h3>
          <p>No more staring at blank screens. Just say what you need — we write the rest.</p>
        </div>
        <div>
          <h3>📑 Clean Reports & Docs</h3>
          <p>Summarize, rephrase, or expand ideas into organized paragraphs.</p>
        </div>
        <div>
          <h3>🛠️ Fix, Polish & Improve</h3>
          <p>Grammar, tone, flow, and structure — instantly optimized.</p>
        </div>
        <div>
          <h3>🧞‍♂️ How It Works</h3>
          <ol className="how-list">
            <li>You provide a general overview</li>
            <li>A refined reply will be provided shortly.</li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2025 TypingGenie · <Link to="/terms" className="footer-link">Terms</Link> · <Link to="/privacy" className="footer-link">Privacy</Link> · <Link to="/contact" className="footer-link">Contact</Link>
      </footer>

      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <Messenger />
      </div>
    </div>
  );
};

export default Home;
