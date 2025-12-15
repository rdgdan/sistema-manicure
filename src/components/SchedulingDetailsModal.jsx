import React from 'react';
import { X, Trash2, Edit } from 'lucide-react';
import './ClientModal.css'; // Reutilizando estilos

const SchedulingDetailsModal = ({ isOpen, onClose, onDelete, onEdit, event }) => {
  if (!isOpen || !event) return null;

  const formattedDate = event.start 
    ? new Date(event.start + 'T00:00:00').toLocaleDateString('pt-BR') 
    : 'Data não disponível';

  const serviceDescription = event.serviceClass && event.serviceSubclass 
    ? `${event.serviceClass} - ${event.serviceSubclass}`
    : (event.nailType || 'Não informado');

  const formattedPrice = `R$ ${parseFloat(event.price || 0).toFixed(2).replace('.', ',')}`;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">Detalhes do Agendamento</h2>
        
        <div className="details-section" style={{ marginTop: '1.5rem' }}>
          <div className="detail-item"><strong>Data:</strong> {formattedDate}</div>
          <div className="detail-item"><strong>Cliente:</strong> {event.clientName || 'Não informado'}</div>
          <div className="detail-item"><strong>Telefone:</strong> {event.clientPhone || 'Não informado'}</div>
          <div className="detail-item"><strong>Serviço:</strong> {serviceDescription}</div>
          <div className="detail-item"><strong>Valor:</strong> {formattedPrice}</div>
          <div className="detail-item"><strong>Pagamento:</strong> {event.paymentStatus || 'Não informado'}</div>
        </div>

        <div className="details-buttons">
          <button className="modal-button danger" onClick={() => onDelete(event.id)}>
            <Trash2 size={16} />
            Excluir
          </button>
          <button className="modal-button primary" onClick={() => onEdit(event)} style={{ marginLeft: 'auto' }}>
            <Edit size={16} />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingDetailsModal;
