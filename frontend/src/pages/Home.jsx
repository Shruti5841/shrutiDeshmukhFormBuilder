import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-left">
          <div className="nav-logo">
            <div className="logo-triangle"></div>
            <span className="logo-text">FormBot</span>
          </div>
        </div>
        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login" className="nav-button sign-in">
                Sign in
              </Link>
              <Link to="/register" className="nav-button create-button">
                Create a FormBot
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="nav-button create-button">
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      <main className="home-main">
        <div className="hero-section">
          <h1 className="hero-title">
            Build advanced <span className="highlight">forms</span> visually
          </h1>
          <p className="hero-subtitle">
            FormBot gives you powerful blocks to create unique form experiences. 
            Embed them anywhere on your web/mobile apps and start collecting results like magic.
          </p>
          <Link to={token ? "/create-form" : "/register"} className="cta-button">
            Create a FormBot for free
          </Link>
        </div>
        <div className="decorative-elements">
          <div className="pink-circle"></div>
          <div className="orange-circle"></div>
          <div className="blue-arc"></div>
        </div>
      </main>
    </div>
  );
};

export default Home; 