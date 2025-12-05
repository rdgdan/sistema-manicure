import React from 'react';
import ReactDOM from 'react-dom';

// Este componente usa um Portal para renderizar o modal fora da hierarquia principal do DOM,
// garantindo que ele sempre apareça por cima de outros elementos.
const SchedulingModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const title = event.target.elements.title.value;
    if (title && selectedDate) {
      const newEvent = {
        title,
        start: selectedDate,
        allDay: true,
        classNames: ['custom-event']
      };
      onSave(newEvent);
    }
  };

  // O conteúdo do modal é renderizado dentro do #modal-root no index.html
  return ReactDOM.createPortal(
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Novo Agendamento</h2>
        <p>Você está agendando um evento para o dia: <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título do Evento</label>
            <input type="text" id="title" name="title" required />
          </div>
          <div className="modal-buttons">
            <button type="button" className="modal-button secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-button primary">
              Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default SchedulingModal;
