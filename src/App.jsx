import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Sidebar from './components/Sidebar';

// Importações baseadas estritamente nos arquivos existentes em src/pages
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import AdminPage from './pages/Admin.jsx';
import AgendaPage from './pages/Agenda.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import ConfiguracoesPage from './pages/Configuracoes.jsx';

import './index.css';

const theme = createTheme({
  fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
  primaryColor: 'violet',
});

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();
    if (loading) return <div>Carregando...</div>;
    if (!currentUser || !isAdmin) return <Navigate to="/dashboard" />;
    return children;
};

const MainLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Rotas Protegidas com Layout Principal */}
              <Route path="/*" element={<ProtectedRoute><MainLayout><Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/agenda" element={<AgendaPage />} />
                <Route path="/clientes" element={<ClientsPage />} />
                <Route path="/servicos" element={<ServicesPage />} />
                <Route path="/configuracoes" element={<ConfiguracoesPage />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              </Routes></MainLayout></ProtectedRoute>} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
