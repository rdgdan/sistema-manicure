import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './ClientModal.css';

const ClientModal = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', since: '' });

  useEffect(() => {
    // Se um cliente for passado, preenche o formulário com seus dados.
    if (client) {
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        since: client.since || new Date().toISOString().split('T')[0], // Garante uma data válida
      });
    } 
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button type="button" className="close-modal-button" onClick={onClose}><X size={24} /></button>
        <h2 className="modal-title">Editar Dados do Cliente</h2>
        
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label htmlFor="name">Nome do Cliente</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="since">Cliente Desde</label>
            <input
              id="since"
              type="date"
              name="since"
              value={formData.since}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-button secondary">
              Cancelar
            </button>
            <button type="submit" className="modal-button primary">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
