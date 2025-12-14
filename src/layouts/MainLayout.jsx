
import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { SidebarContext } from '../context/sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { isCollapsed } = useContext(SidebarContext);

  // Lógica de classe explícita: aplica 'expanded' ou 'collapsed'
  const contentClassName = `main-content ${isCollapsed ? 'collapsed' : 'expanded'}`;

  return (
    <div className="app-layout">
      <Sidebar />
      {/* A className agora é controlada dinamicamente pela variável */}
      <main className={contentClassName}>
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
