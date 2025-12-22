
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import './UserEditModal.css';

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
  // Correção: Inicializa o estado com chaves definidas para evitar inputs não controlados.
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    isAdmin: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Se um usuário for passado, preenche o estado do formulário.
    // Se não, reseta para o estado inicial vazio.
    if (user) {
      setUserData({
        displayName: user.displayName || '',
        email: user.email || '',
        isAdmin: user.roles?.includes('admin') || false,
      });
    } else {
      setUserData({ displayName: '', email: '', isAdmin: false });
    }
  }, [user, isOpen]); // Roda também quando o modal é aberto/fechado

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const roles = userData.isAdmin ? ['admin'] : [];
    const finalUserData = {
      displayName: userData.displayName,
      email: userData.email,
      roles: roles
    };

    await onSave(user.id, finalUserData);
    setIsSaving(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content user-edit-modal">
        <div className="modal-header">
          <h2>Editar Usuário</h2>
          <button onClick={onClose} className="close-button" disabled={isSaving}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="displayName">Nome de Exibição</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={userData.displayName}
              onChange={handleChange}
              placeholder="Nome visível no sistema"
              disabled={isSaving}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="E-mail de login"
              disabled={isSaving}
            />
          </div>
          <div className="form-group">
             <label className="switch-list-item" title="Conceder ou remover privilégios de administrador">
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={userData.isAdmin}
                    onChange={handleChange}
                    disabled={isSaving}
                />
                <span className="slider round"></span>
                <span className='switch-label'>Permissão de Administrador</span>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="loader-sm"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
