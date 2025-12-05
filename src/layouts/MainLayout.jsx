import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, LogOut, ChevronLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    // ESTRUTURA CORRETA APLICADA AQUI - CORRESPONDE AO App.css
    <div className="app-layout">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* O conteúdo da sidebar permanece o mesmo */}
        <div className="sidebar-header">
          <div className="logo-container">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#BF93FD" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 7L12 12L22 7" stroke="#BF93FD" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 12V22" stroke="#BF93FD" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span className="logo-text">By Borges</span>
          </div>
          <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={22} />
            <span className="nav-text">Início</span>
          </NavLink>
          <NavLink to="/agenda" className={`nav-item ${isActive('/agenda') ? 'active' : ''}`}>
            <Calendar size={22} />
            <span className="nav-text">Agenda</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            <span className="nav-text">{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={22} />
            <span className="nav-text">Sair</span>
          </button>
          <div className="sidebar-signature">
            <span className="nav-text">@nailsdesignbyborges</span>
          </div>
        </div>
      </aside>

      {/* O MAIN CONTENT E O PAGE CONTAINER QUE FALTAVAM */}
      <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="page-container">
          {children} {/* A sua página (Agenda) será renderizada aqui dentro */}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
