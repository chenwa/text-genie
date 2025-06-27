import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => (
  <div className="nf-form-container privacy-container" style={{ maxWidth: 700, margin: '40px auto', padding: '2em 2.5em', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'left', alignItems: 'flex-start', display: 'block', position: 'relative' }}>
    <button className="nf-home-btn" type="button" onClick={() => window.history.back()} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&#10005;</button>
    <h2 className="nf-form-title" style={{ marginBottom: 24 }}>Privacy Policy</h2>
    <p>Your privacy is important to us. This policy explains how TypingGenie collects, uses, and protects your information.</p>

    <h3>1. Information We Collect</h3>
    <ul>
      <li><strong>Account Information:</strong> When you sign up, we collect your email and password.</li>
      <li><strong>Usage Data:</strong> We collect information about how you use TypingGenie, such as the features you use and the content you generate.</li>
      <li><strong>Cookies:</strong> We use cookies and similar technologies to improve your experience and analyze usage.</li>
    </ul>

    <h3>2. How We Use Your Information</h3>
    <ul>
      <li>To provide and improve TypingGenie’s services.</li>
      <li>To communicate with you about your account or updates.</li>
      <li>To maintain security and prevent abuse.</li>
      <li>To analyze usage and improve our product.</li>
    </ul>

    <h3>3. Data Sharing</h3>
    <ul>
      <li>We do not sell your personal information.</li>
      <li>We may share data with trusted service providers who help us operate TypingGenie (e.g., cloud hosting, analytics), but only as needed and under confidentiality agreements.</li>
      <li>We may disclose information if required by law or to protect our rights and users.</li>
    </ul>

    <h3>4. Data Security</h3>
    <p>We use reasonable security measures to protect your data. However, no system is 100% secure, so please use TypingGenie responsibly.</p>

    <h3>5. AI Content</h3>
    <p>Content you enter may be processed by third-party AI providers to generate responses. We do not use your content to train public AI models.</p>

    <h3>6. Your Choices</h3>
    <ul>
      <li>You can update or delete your account at any time by contacting us.</li>
      <li>You may opt out of marketing emails at any time.</li>
    </ul>

    <h3>7. Changes to This Policy</h3>
    <p>We may update this policy from time to time. We will notify you of significant changes by posting an update on our website.</p>

    <h3>8. Contact</h3>
    <p>If you have questions about this policy, please <Link to="/contact">contact us</Link>.</p>

    <footer className="nf-footer nf-footer-small" style={{ marginTop: 32 }}>
      &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
    </footer>
  </div>
);

export default Privacy;
