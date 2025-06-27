import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import '../App.css';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError('First name, last name, email, and password are required.');
      return;
    }
    try {
      const user = {
        id: 0, // This will be set by the backend
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        org: 'neutralfit',
      };
      const res = await fetch(`${API_BASE_URL}/create_user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/club-fitting');
      } else {
        setError('Sign up failed.');
      }
    } catch (err) {
      setError('Sign up failed.');
    }
  };

  return (
    <div className="nf-form-container">
      <button className="nf-home-btn" type="button" onClick={() => navigate('/')} aria-label="Close">&#10005;</button>
      <h2 className="nf-form-title">Sign Up</h2>
      <form className="nf-form nf-form-small" onSubmit={handleSubmit}>
        <div className="nf-form-row">
          <input className="nf-input" name="first_name" placeholder="First Name*" value={formData.first_name} onChange={handleChange} required />
          <input className="nf-input" name="last_name" placeholder="Last Name*" value={formData.last_name} onChange={handleChange} required />
        </div>
        <input className="nf-input" name="email" type="email" placeholder="Email*" value={formData.email} onChange={handleChange} required />
        <input className="nf-input" name="password" type="password" placeholder="Password*" value={formData.password} onChange={handleChange} required />
        <button className="nf-btn nf-btn-primary nf-form-btn" type="submit">Sign Up</button>
      </form>
      {error && <div className="nf-error">{error}</div>}
      <div className="nf-info-section">
        <strong>Note:</strong> <Link to="/login">Login</Link> if you already have an account. <br /> <br />
        <strong>Privacy Notice:</strong> NeutralFit does <u>not</u> collect, sell, or share your data. We will never send you marketing emails or share your information with third parties.
      </div>
      <div className="nf-info-section">
        <h3>Why do we need this info?</h3>
        <p>
          We ask for your information to make sure you're a real person and not an internet bot trying to misuse our platform. This helps us keep NeutralFit safe and secure for everyone. Rest assured, your data is protected and will only be used to provide you with the best experience possible.
        </p>
      </div>
      <footer className="nf-footer nf-footer-small">
        &copy; {new Date().getFullYear()} NeutralFit. All rights reserved.
      </footer>
    </div>
  );
};

export default Signup;
