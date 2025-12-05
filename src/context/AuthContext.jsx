
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// 1. Criação do Contexto
const AuthContext = createContext();

// 2. Hook customizado para facilitar o uso
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função de Logout - será chamada pelo botão na Sidebar
  const logout = () => {
    return signOut(auth);
  };

  // Observador que monitora o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Função de limpeza para remover o observador quando o componente for desmontado
    return unsubscribe;
  }, []);

  // O valor fornecido para os componentes filhos
  const value = {
    currentUser,
    logout
  };

  // Não renderiza os filhos até que o estado de autenticação seja carregado
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
