import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { token } = useAuth();

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-square"></div>
            <span>FormBot</span>
          </div>
        </div>
        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Create a FormBot
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <div className="decorative-left"></div>
          <div className="decorative-right"></div>

          <h1>
            Build advanced <span className="highlight">forms</span>
            <br />
            visually
          </h1>

          <p className="hero-text">
            FormBot gives you powerful blocks to create unique form experiences. 
            Embed them anywhere on your web/mobile apps and start collecting results like magic.
          </p>

          <Link
            to={token ? "/create-form" : "/register"}
            className="btn btn-primary btn-large"
          >
            Create a FormBot for free
          </Link>
        </div>

        <div className="product-demo">
          <img
            src="https://images.unsplash.com/photo-1719937050814-72892488f741?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
            alt="FormBot builder interface"
            className="demo-image"
          />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Product</h3>
            <a href="#">Status</a>
            <a href="#">Documentation</a>
            <a href="#">Roadmap</a>
            <a href="#">Pricing</a>
          </div>

          <div className="footer-section">
            <h3>Community</h3>
            <a href="#">Discord</a>
            <a href="#">GitHub repository</a>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-logo">
            <div className="logo-square"></div>
            <span>FormBot</span>
          </div>
          <p>Made with ❤️ by @ShrutiDeshmukh</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
