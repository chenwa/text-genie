import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for expire time in query params
  const params = new URLSearchParams(location.search);
  const expire = params.get('ct');
  console.log('ForgotPassword.tsx: ct param =', expire);
  let expired = false;
  if (expire) {
    const expireTime = Number(expire);
    if (!isNaN(expireTime)) {
      const now = Date.now();
      if (now - expireTime > 60 * 60 * 1000) {
        expired = true;
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/send_forgot_password_email/${encodeURIComponent(email)}/typinggenie`, {
        method: 'GET',
      });
      if (res.ok) {
        setMessage('If registered, a reset link has been sent.');
      } else {
        setError('Failed to send reset email.');
      }
    } catch (err) {
      setError('Failed to send reset email.');
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">Forgot Password</h2>
      {expired && (
        <div className="nf-error">Your password reset link has expired. Please request a new one.</div>
      )}
      <form className="nf-form" onSubmit={handleSubmit}>
        <input
          className="nf-input"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit">Send Reset Link</button>
      </form>
      {message && <div className="nf-success">{message}</div>}
      {error && <div className="nf-error">{error}</div>}
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPassword;
