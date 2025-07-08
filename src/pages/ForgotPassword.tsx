import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { callForgotPasswordAPI } from '../utils/api_utils';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await callForgotPasswordAPI(email);
      setMessage(t.resetPassword + ' ' + (t.demoPolished || 'Check your email for reset instructions.'));
    } catch (err) {
      setError(t.sorryProblem || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">{t.resetPassword}</h2>
      {expired && (
        <div className="nf-error">{t.forgotPasswordExpired}</div>
      )}
      <form className="nf-form" onSubmit={handleSubmit}>
        <input
          className="nf-input"
          name="email"
          type="email"
          placeholder={t.contact + ' Email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit" disabled={loading}>
          {loading ? t.resetPassword : t.resetPassword}
        </button>
      </form>
      {message && <div className="nf-success">{message}</div>}
      {error && <div className="nf-error">{error}</div>}
      <div className="nf-info-section">
        <Link to="/login" className="nf-link">{t.login}</Link>
      </div>
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPassword;
