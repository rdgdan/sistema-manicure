
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useSidebar } from '../context/sidebarContext';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';
import { Home, Calendar, Users, LogOut, ChevronLeft, ChevronRight, Sun, Moon, Sparkles } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
        await logout();
        navigate('/login');
    } catch (error) {
        console.error("Failed to logout: ", error);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <Sparkles className="logo-icon" />
          <span className="logo-text">By Borges</span>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item" end>
          <Home size={22} />
          <span className="nav-text">Início</span>
        </NavLink>
        <NavLink to="/agenda" className="nav-item">
          <Calendar size={22} />
          <span className="nav-text">Agenda</span>
        </NavLink>
        <NavLink to="/clientes" className="nav-item">
          <Users size={22} />
          <span className="nav-text">Clientes</span>
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
        <p className="sidebar-signature">@nailsdesignbyborges</p>
      </div>
    </aside>
  );
};

export default Sidebar;
