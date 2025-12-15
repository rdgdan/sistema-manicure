import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Agenda from './pages/Agenda.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import MainLayout from './components/MainLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const PrivateLayout = () => {
  return (
    <PrivateRoute>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </PrivateRoute>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirecionamento da raiz para o dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Rotas Privadas aninhadas sob o layout principal */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/clientes" element={<ClientsPage />} />
      </Route>

      {/* Rota de Fallback para qualquer caminho não encontrado */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
