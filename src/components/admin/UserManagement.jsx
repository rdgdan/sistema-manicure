
import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers, deleteUserAccount, updateUserDetails } from '../../services/firestoreService';
import { Loader, Search, AlertTriangle, Users, Edit, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';
import UserEditModal from './UserEditModal';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Estado para o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (err) {
      setError('Falha ao carregar a lista de usuários.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message, type) => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000); // Limpa o feedback após 4 segundos
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Tem certeza que deseja EXCLUIR permanentemente o usuário ${userEmail}? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteUserAccount(userId);
        setUsers(users.filter(u => u.id !== userId));
        showFeedback(`Usuário ${userEmail} excluído com sucesso.`, 'success');
      } catch (err) {
        console.error("Erro ao excluir:", err);
        showFeedback(`Falha ao excluir o usuário: ${err.message}`, 'error');
      }
    }
  };
  
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async (userId, updatedData) => {
    try {
      await updateUserDetails(userId, updatedData);
      // Atualiza a lista de usuários localmente para refletir as mudanças instantaneamente
      setUsers(users.map(u => u.id === userId ? { ...u, ...updatedData } : u));
      showFeedback('Usuário atualizado com sucesso!', 'success');
      handleCloseModal();
    } catch (err) {
        console.error("Erro ao salvar:", err);
        showFeedback(`Falha ao salvar as alterações: ${err.message}`, 'error');
        // Não feche o modal em caso de erro, para o usuário poder tentar novamente
        throw err; // Lança o erro para que o modal saiba que a operação falhou
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.displayName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="admin-feedback-state">
          <Loader className="spin-icon" size={32} />
          <p>Carregando usuários...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-feedback-state error">
          <AlertTriangle size={32} />
          <p>{error}</p>
        </div>
      );
    }

    if (users.length === 0) {
        return (
            <div className="admin-feedback-state">
              <Users size={32} />
              <p>Nenhum usuário cadastrado no sistema ainda.</p>
            </div>
        );
    }
    
    if (filteredUsers.length === 0 && searchQuery) {
        return (
            <div className="admin-feedback-state">
              <p>Nenhum usuário encontrado com o termo "{searchQuery}".</p>
            </div>
        );
    }

    return (
      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Admin</th>
              <th>Data de Cadastro</th>
              <th className="actions-header">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.displayName || <span className='text-muted'>Não definido</span>}</td>
                <td>{user.email}</td>
                <td className='text-center'>
                    {user.roles?.includes('admin') ? 
                        <ShieldCheck size={20} className='icon-admin-yes' title='Administrador'/> : 
                        <ShieldOff size={20} className='icon-admin-no' title='Usuário Padrão'/>
                    }
                </td>
                <td>{user.createdAt?.toDate().toLocaleDateString('pt-BR') || 'N/A'}</td>
                <td className='actions-cell'>
                  <button className='action-btn edit' onClick={() => handleOpenEditModal(user)} title="Editar usuário">
                    <Edit size={16} />
                  </button>
                  <button className='action-btn delete' onClick={() => handleDeleteUser(user.id, user.email)} title="Excluir usuário">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      {feedback.message && (
        <div className={`feedback-banner ${feedback.type}`}>
          <p>{feedback.message}</p>
        </div>
      )}
      <div className="user-management-header">
        <h2>Gerenciamento de Usuários</h2>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading || users.length === 0}
          />
        </div>
      </div>
      {renderContent()}

      {/* O Modal de Edição */}
      <UserEditModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default UserManagement;
