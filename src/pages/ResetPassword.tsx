import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from query string
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
  const paramObj: Record<string, string> = {};

  // Parse and decode token if present
  if (token) {
    try {
      // Add padding if needed for base64 decoding
      let padded = token;
      if (token.length % 4 !== 0) {
        padded += '='.repeat(4 - (token.length % 4));
      }
      const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
      // decoded is like: et=...&em=...&org=...
      decoded.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        paramObj[key] = value;
      });

      // console.log('Decoded token params:', paramObj);
    } catch (err) {
      console.log('Failed to decode token:', err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Check if expiration time is valid
    const now = new Date();
    const etStr = paramObj['et'];
    const etDate = new Date(etStr.replace(' ', 'T') + 'Z'); // Parse as UTC
    const diffMs = now.getTime() - etDate.getTime();
    console.log('Expiration time:', etDate, 'Current time:', now, 'Difference (ms):', diffMs);

    if (!password || !confirmPassword) {
      setError('Two passwords are required.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
        if (!paramObj['em'] || !paramObj['org'] || !paramObj['et']) {
            setError('Invalid reset link. Please request a new one.');
            setLoading(false);
            return;
        }
        if (diffMs > 60 * 60 * 1000) {
            setError('Reset link has expired. Please request a new one.');
            setLoading(false);
            return;
        }
      const res = await fetch(`${API_BASE_URL}/reset_user_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: paramObj["em"],
          org: paramObj["org"],
          new_password: password
        }),
      });
      if (res.ok) {
        setMessage('Your password has been reset. You can now log in.');
        setTimeout(() => navigate('/login'), 2000); // Redirect to home after 2 seconds
      } else {
        setError('Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">Reset Password</h2>
      <form className="nf-form" onSubmit={handleSubmit}>
        <input
          className="nf-input"
          name="password"
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="nf-input"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <div className="nf-success">{message}</div>}
      {error && <div className="nf-error">{error}</div>}
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} TypingGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default ResetPassword;
