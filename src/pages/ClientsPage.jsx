import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi';
import { getClients, addClient, updateClient, deleteClient, addSchedule } from '../services/firestoreService';
import ClientModal from '../components/ClientModal';
import SchedulingModal from '../components/SchedulingModal';
import './ClientsPage.css';

const formatDate = (isoString) => {
  if (!isoString) return '--';
  return new Date(isoString).toLocaleDateString('pt-BR');
};

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientForScheduling, setClientForScheduling] = useState(null);

  const fetchClients = useCallback(async () => {
    const clientsData = await getClients();
    setClients(clientsData);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // --- Handlers para Modal de Cliente (usado para EDIÇÃO) ---
  const handleOpenClientModal = (client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setEditingClient(null);
    setIsClientModalOpen(false);
  };

  const handleSaveClient = async (clientData) => {
    if (editingClient) {
      await updateClient(editingClient.id, clientData);
      fetchClients(); // Atualiza a lista após a edição
    }
    handleCloseClientModal();
  };

  const handleDeleteClient = async (clientId) => {
    await deleteClient(clientId);
    setClients(clients.filter(c => c.id !== clientId));
  };

  // --- Handlers para Modal de Agendamento ---
  const handleOpenSchedulingModal = (client = null) => {
    setClientForScheduling(client);
    setIsSchedulingModalOpen(true);
  };

  const handleCloseSchedulingModal = () => {
    setClientForScheduling(null);
    setIsSchedulingModalOpen(false);
  };

  const handleSaveSchedule = async (scheduleData) => {
    await addSchedule(scheduleData);
    fetchClients(); // Atualiza a lista de clientes, caso um novo tenha sido adicionado
    handleCloseSchedulingModal();
  };

  return (
    <div className="clients-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Clientes</h1>
          <p>Gerencie seus clientes e agende novos horários de forma rápida.</p>
        </div>
        {/* Botão principal agora é "Novo Agendamento" */}
        <button className="add-client-btn" onClick={() => handleOpenSchedulingModal()}>
          <FiCalendar />
          <span>Novo Agendamento</span>
        </button>
      </header>

      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>Telefone</th>
              <th>Cliente Desde</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.phone || '--'}</td>
                <td>{formatDate(client.since)}</td>
                <td className="action-cell">
                  <button className="action-btn schedule-btn" onClick={() => handleOpenSchedulingModal(client)} title="Agendar para Cliente">
                    <FiCalendar />
                  </button>
                  <button className="action-btn edit-btn" onClick={() => handleOpenClientModal(client)} title="Editar Cliente">
                    <FiEdit />
                  </button>
                  <button className="action-btn delete-btn" onClick={() => handleDeleteClient(client.id)} title="Excluir Cliente">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isClientModalOpen && (
        <ClientModal
          client={editingClient}
          onSave={handleSaveClient}
          onClose={handleCloseClientModal}
        />
      )}

      {isSchedulingModalOpen && (
        <SchedulingModal
          isOpen={isSchedulingModalOpen}
          onClose={handleCloseSchedulingModal}
          onSave={handleSaveSchedule}
          clientForScheduling={clientForScheduling}
        />
      )}
    </div>
  );
};

export default ClientsPage;
