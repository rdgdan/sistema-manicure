
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import MainLayout from './layouts/MainLayout';

// Este componente protege as rotas que exigem autenticação
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  // Se não houver usuário logado, redireciona para a página de login
  return currentUser ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota pública para o login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas privadas que usam o MainLayout */}
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes> { /* Um conjunto de rotas aninhadas */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/agenda" element={<Agenda />} />
                 {/* Se nenhuma outra rota corresponder, redireciona para o dashboard */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
