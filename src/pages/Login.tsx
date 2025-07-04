import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callLoginAPI } from '../api/api_utils';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await callLoginAPI(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">Login</h2>
      <form className="nf-form" onSubmit={handleSubmit}>
        <input
          className="nf-input"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="nf-input"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit">Login</button>
      </form>
      {error && <div className="nf-error">{error}</div>}
      <div className="nf-info-section">
        Forgot your password? Click{' '}
        <Link to="/forgot-password" className="nf-link nf-forgot-link">Reset Password</Link>
      </div>
      <div className="nf-info-section">
        Please <Link to="/signup">Sign Up</Link> if you don't have an account.
      </div>
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
