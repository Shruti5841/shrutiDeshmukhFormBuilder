'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="decorative-circle top-right"></div>
      <div className="decorative-circle bottom-right"></div>

      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={24} />
      </button>

      <div className="logo-container">
        <div className="logo"></div>
      </div>

      <main className="login-content">
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button type="button" className="google-button">
            <img 
              src="/google-icon.svg" 
              alt="Google logo"
              className="google-icon"
            />
            Sign in with Google
          </button>

          <p className="register-prompt">
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register now
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
