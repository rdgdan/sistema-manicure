import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  // Corrigido para usar as propriedades corretas do contexto
  const { currentUser, logout, isAdmin, debugClaims } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-content">
        {currentUser && (
          <div className="user-info">
            
            {/* Informações de depuração */}
            <div style={{ 
                border: '2px solid red', 
                padding: '10px', 
                margin: '10px', 
                backgroundColor: '#fdd' 
            }}>
                <h4 style={{ margin: 0, padding: 0, fontWeight: 'bold'}}>INFORMAÇÕES DE DEPURAÇÃO</h4>
                <p><strong>Usuário Logado:</strong> {currentUser.email}</p>
                <p><strong>É Admin (frontend)?</strong> {isAdmin ? 'Sim' : 'Não'}</p>
                <p><strong>Permissões Recebidas (Claims):</strong></p>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(debugClaims, null, 2)}
                </pre>
            </div>

            <span className="user-email">{currentUser.email}</span>
            <button onClick={logout} className="logout-btn" title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
