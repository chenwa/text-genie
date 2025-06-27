import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send the message to your backend or support system
  };

  return (
    <div className="nf-form-container" style={{ maxWidth: 700, margin: '40px auto', padding: '2em 2.5em', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'left', display: 'block', alignItems: 'flex-start', position: 'relative' }}>
      <button className="nf-home-btn" type="button" onClick={() => window.history.back()} aria-label="Close" style={{ position: 'absolute', top: 18, right: 18, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&#10005;</button>
      <h2 className="nf-form-title" style={{ marginBottom: 24 }}>Contact Us</h2>
      <p>Have a question, suggestion, or need help? Email us at <a href="mailto:contact@typinggenie.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>contact@typinggenie.com</a>.</p>
      <h3 style={{ marginTop: 32 }}>Support Hours</h3>
      <p>We aim to respond to all inquiries within 1 business day. Our support team is available Monday–Friday, 9am–6pm (US Eastern Time).</p>
      <h3 style={{ marginTop: 32 }}>Feedback & Feature Requests</h3>
      <p>We love hearing from our users! If you have ideas for new features or improvements, please let us know. Your feedback helps us make TypingGenie better for everyone.</p>
      <h3 style={{ marginTop: 32 }}>Business & Partnerships</h3>
      <p>If you are interested in business partnerships, API access, or custom solutions, please reach out to <a href="mailto:contact@typinggenie.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>contact@typinggenie.com</a> with details about your inquiry.</p>
      {/* Optionally keep the form for future use, or remove it if not needed */}
      {/*
      {submitted ? (
        <div className="nf-success" style={{ margin: '1em 0' }}>
          Thank you for reaching out! We have received your message.
        </div>
      ) : (
        <form className="nf-form" onSubmit={handleSubmit}>
          <input
            className="nf-input"
            type="email"
            name="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            className="nf-input"
            name="message"
            placeholder="How can we help you?"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            required
          />
          <button className="nf-btn nf-btn-primary nf-form-btn" type="submit">Send Message</button>
        </form>
      )}
      */}
      <footer className="nf-footer nf-footer-small" style={{ marginTop: 32 }}>
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;
