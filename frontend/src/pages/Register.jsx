import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await fetch('https://shrutideshmukhformbuilderfinal.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: username,
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <div className="auth-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      <div className="auth-left">
        <div className="auth-logo">
          <div className="logo-triangle"></div>
        </div>
      </div>
      <div className="auth-right">
        <div className="pink-circle"></div>
        <div className="orange-circle"></div>
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && <div className="error-text">{error}</div>}
            </div>
            <button type="submit" className="auth-button">
              Sign Up
            </button>
            <div className="auth-divider">
              <span>OR</span>
            </div>
            <button type="button" className="google-button">
              <img src="/google-icon.svg" alt="Google" />
              Sign Up with Google
            </button>
            <div className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 