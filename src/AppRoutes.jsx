
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/auth';

// Layout e Páginas
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import ClientsPage from './pages/ClientsPage'; // Importando a nova página

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/login" element={<Login />} />

      {/* Rotas privadas aninhadas sob o MainLayout */}
      <Route 
        path="/*" 
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agenda" element={<Agenda />} />
                {/* --- ROTA ADICIONADA AQUI --- */}
                <Route path="/clientes" element={<ClientsPage />} />
                {/* Rota de fallback, redireciona para a home se não encontrar */}
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
