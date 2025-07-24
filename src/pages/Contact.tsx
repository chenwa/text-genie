import React from 'react';

const Contact: React.FC = () => {

  return (
    <div className="nf-form-container" style={{ maxWidth: 700, margin: '40px auto', padding: '2em 2.5em', background: 'var(--bg-secondary)', borderRadius: 12, boxShadow: '0 2px 12px var(--shadow-medium)', textAlign: 'left', display: 'block', alignItems: 'flex-start', position: 'relative' }}>
      <button className="nf-home-btn" type="button" onClick={() => window.history.back()} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&#10005;</button>
      <h2 className="nf-form-title" style={{ marginBottom: 24 }}>Contact Us</h2>
      <p>Have a question, suggestion, or need help? Email us at <a href="mailto:contact@typinggenie.com" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>contact@typinggenie.com</a>.</p>
      <h3 style={{ marginTop: 32 }}>Support Hours</h3>
      <p>We aim to respond to all inquiries within 1 business day. Our support team is available Monday–Friday, 9am–6pm (US Eastern Time).</p>
      <h3 style={{ marginTop: 32 }}>Feedback & Feature Requests</h3>
      <p>We love hearing from our users! If you have ideas for new features or improvements, please let us know. Your feedback helps us make TypingGenie better for everyone.</p>
      <h3 style={{ marginTop: 32 }}>Business & Partnerships</h3>
      <p>If you are interested in business partnerships, API access, or custom solutions, please reach out to &nbsp;
        <a href="mailto:business@typinggenie.com" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>business@typinggenie.com</a> with details about your inquiry.</p>
      <footer className="nf-footer nf-footer-small" style={{ marginTop: 32 }}>
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;
