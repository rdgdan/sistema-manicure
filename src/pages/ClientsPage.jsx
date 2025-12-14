
import React from 'react';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi'; // Ícones para ações
import './ClientsPage.css';

// --- Dados Fictícios de Clientes ---
const mockClients = [
  { id: 1, name: 'Ana Silva', nailType: 'Francesinha', nextAppointment: '25/07/2024', lastPayment: '28/06/2024' },
  { id: 2, name: 'Beatriz Costa', nailType: 'Stiletto', nextAppointment: '28/07/2024', lastPayment: '01/07/2024' },
  { id: 3, name: 'Carla Dias', nailType: 'Amendoada', nextAppointment: '02/08/2024', lastPayment: '05/07/2024' },
  { id: 4, name: 'Daniela Ferraz', nailType: 'Bailarina', nextAppointment: '05/08/2024', lastPayment: '10/07/2024' },
  { id: 5, name: 'Eduarda Matos', nailType: 'Fibra de Vidro', nextAppointment: '10/08/2024', lastPayment: '15/07/2024' },
  { id: 6, name: 'Fernanda Lima', nailType: 'Francesinha', nextAppointment: '12/08/2024', lastPayment: '18/07/2024' },
];

const ClientsPage = () => {
  return (
    <div className="clients-page">
      {/* --- Cabeçalho da Página --- */}
      <header className="page-header">
        <div className="header-content">
          <h1>Clientes</h1>
          <p>Gerencie, adicione e veja os detalhes dos seus clientes.</p>
        </div>
        <button className="add-client-btn">
          <FiPlusCircle />
          <span>Adicionar Cliente</span>
        </button>
      </header>

      {/* --- Tabela de Clientes --- */}
      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nome do Cliente</th>
              <th>Tipo de Unha</th>
              <th>Próximo Agendamento</th>
              <th>Último Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.nailType}</td>
                <td>{client.nextAppointment}</td>
                <td>{client.lastPayment}</td>
                <td className="action-cell">
                  <button className="action-btn edit-btn" title="Editar Cliente">
                    <FiEdit />
                  </button>
                  <button className="action-btn delete-btn" title="Excluir Cliente">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
