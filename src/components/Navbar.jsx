import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-content">
        {currentUser && (
          <div className="user-info">
            <span className="user-email">{currentUser.email}</span>
            <button onClick={logout} className="logout-btn" title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
