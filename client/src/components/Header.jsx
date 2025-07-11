import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { logout } from '../services/authService';

function Header({ user, setShowLogin, setShowSignup, setShowRegister, setUser, isRegistered, checkRegistration, handleRegistered }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/voter/profile');
    setMenuOpen(false);
  };

  const handleRegisterClick = async () => {
    if (isRegistered) {
      alert('You are already registered as a voter. Your voter details are already in the system. You are eligible to participate in the election.');
      setMenuOpen(false);
      return;
    }
    setShowRegister(true);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    if (setUser) setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <h1 className="header-title">Election Management</h1>

      <div className="header-buttons">
        {!user ? (
          <>
            <button className="header-btn" onClick={() => setShowLogin(true)}>Log In</button>
            <button className="header-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
          </>
        ) : user.role === 'voter' ? (
          <div>
            <div className="profile-icon" onClick={() => setMenuOpen(!menuOpen)}>
              <span role="img" aria-label="user">👤</span>
            </div>
            <div className={`profile-menu ${menuOpen ? 'show' : ''}`}>
              <button className="menu-item" onClick={handleProfileClick}>My Profile</button>
              <button className="menu-item" onClick={handleRegisterClick}>Register</button>
              <button className="menu-item" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : user.role === 'committee' ? (
          <button className="header-btn" onClick={handleLogout}>Logout</button>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
