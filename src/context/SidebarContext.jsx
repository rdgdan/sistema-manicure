
import React, { createContext, useState, useContext } from 'react';

// 1. Criação do Contexto
const SidebarContext = createContext();

// 2. Provedor do Contexto
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // O estado inicial é "expandido"

  // A função que altera o estado
  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };

  // O valor fornecido para os componentes filhos
  const value = { 
    isCollapsed, 
    toggleSidebar 
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar deve ser usado dentro de um SidebarProvider');
  }
  return context;
};
