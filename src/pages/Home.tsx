import React from 'react';
import { Link } from 'react-router-dom';
import Messenger from '../components/Messenger';

const Home: React.FC = () => {
  const demoRef = React.useRef<HTMLDivElement>(null);
  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (demoRef.current) {
      demoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Personal Writing Assistant — <span className="hero-highlight">Powered by AI Magic</span>
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
            TypingGenie helps you go from idea to polished text in seconds.
          </p>
          <div className="hero-cta-row">
            <Link to="/signup" className="hero-signup-btn">Sign Up for Free</Link>
          </div>
          <div className="hero-tagline">
            <em>“Just type your idea. We'll handle the words.”</em>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section ref={demoRef} id="demo-section" className="demo-section">
        <h2 className="demo-title">✨ Try TypingGenie Demo</h2>
        <div className="demo-desc">💬 Describe what you need help writing…</div>
        <textarea className="demo-textarea" placeholder='e.g. "Tell my boss I need to take Friday off for a family emergency."' />
        <div className="demo-row">
          <select className="demo-select" defaultValue="Formal Email">
            <option>Formal Email</option>
            <option>Friendly Note</option>
            <option>Summary</option>
            <option>Report/Review</option>
            <option>Invitation</option>
            <option>Announcement</option>
            <option>Complaint</option>
            <option>Story</option>
            <option>Poem</option>
          </select>
          <select className="demo-select" defaultValue="Neutral">
            <option>Neutral</option>
            <option>Friendly</option>
            <option>Professional</option>
            <option>Confident</option>
            <option>Empathetic</option>
            <option>Encouraging</option>
            <option>Assertive</option>
            <option>Apologetic</option>
            <option>Optimistic</option>
            <option>Persuasive</option>
            <option>Passionate</option>
            <option>Romantic</option>
            <option>Angry</option>
          </select>
          <button className="demo-generate-btn">➤ Generate Text</button>
        </div>
        <div className="demo-output">
          <em>✨ Polished response will appear here</em>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div>
          <h3>How It Works</h3>
          <ol className="how-list">
            <li>You give a rough idea</li>
            <li>TypingGenie refines & rewrites it</li>
          </ol>
        </div>
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
