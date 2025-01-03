import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Form Builder</Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-form">Create Form</Link>
            <Link to="/public-forms">Available Forms</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 


// {token ? (
//   <>
//     <Link to="/dashboard">Dashboard</Link>
//     <Link to="/create-form">Create Form</Link>
//     <Link to="/public-forms">Available Forms</Link>
//     <button onClick={logout}>Logout</button>
//   </>
// ) : (
//   <>
//     <Link to="/login">Login</Link>
//     <Link to="/register">Register</Link>
//   </>
// )}