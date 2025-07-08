import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callLoginAPI } from '../api/api_utils';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await callLoginAPI(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(t.sorryProblem || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">{t.login}</h2>
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
        <input
          className="nf-input"
          name="password"
          type="password"
          placeholder={t.privacy + ' Password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit" disabled={loading}>
          {loading ? t.login : t.login}
        </button>
      </form>
      {error && <div className="nf-error">{error}</div>}
      <div className="nf-info-section">
        {t.forgotPassword} <Link to="/forgot-password" className="nf-link nf-forgot-link">{t.resetPassword}</Link>
      </div>
      <div className="nf-info-section">
        {t.signupEncouragement} <Link to="/signup">{t.signUp}</Link>
      </div>
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
