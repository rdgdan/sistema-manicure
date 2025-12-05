
import React, { useState } from 'react';

const SchedulingModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [startTime, setStartTime] = useState('09:00');

  // LÓGICA CORRIGIDA: Calculamos o endTime diretamente, sem useEffect.
  // Isso é mais eficiente e evita o erro do ESLint.
  const calculateEndTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    startDate.setHours(startDate.getHours() + 3);
    const endHours = String(startDate.getHours()).padStart(2, '0');
    const endMinutes = String(startDate.getMinutes()).padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  };

  const endTime = calculateEndTime(startTime);

  const handleSave = (e) => {
    e.preventDefault();
    if (!clientName || !serviceType) {
      alert('Por favor, preencha o nome da cliente e o modelo de unha.');
      return;
    }
    onSave({
      title: `${clientName} (${serviceType})`,
      start: `${selectedDate}T${startTime}`,
      end: `${selectedDate}T${endTime}`,
      extendedProps: { service: serviceType },
    });
    setClientName('');
    setServiceType('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Novo Agendamento</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="clientName">Nome da Cliente</label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceType">Modelo de Unha</label>
            <input
              id="serviceType"
              type="text"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Horário</label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="modal-button secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="modal-button primary">Salvar Agendamento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulingModal;
