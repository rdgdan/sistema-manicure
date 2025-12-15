import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.jsx';

const PrivateRoute = ({ children }) => {
  // O `auth` aqui é o objeto `value` do AuthProvider
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // A verificação de `loading` já é feita no AuthProvider, 
  // então aqui só precisamos checar se o usuário está autenticado.

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login.
    // O `state={{ from: location }}` permite redirecionar o usuário de volta 
    // para a página que ele estava tentando acessar após o login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (a rota protegida).
  return children;
};

export default PrivateRoute;
