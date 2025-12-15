import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getServiceCategories } from '../services/firestoreService';
import './SchedulingModal.css';

const ProgressBar = ({ currentStep }) => (
  <ol className="progress-bar">
    <li className={currentStep >= 1 ? 'progress-step active' : 'progress-step'}><span>1</span>Serviço</li>
    <li className={currentStep >= 2 ? 'progress-step active' : 'progress-step'}><span>2</span>Detalhes</li>
    <li className={currentStep >= 3 ? 'progress-step active' : 'progress-step'}><span>3</span>Confirmar</li>
  </ol>
);

const SchedulingModal = ({ isOpen, onClose, onSave, selectedDate, eventToEdit, clientForScheduling }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [serviceCategories, setServiceCategories] = useState([]);
  const [subclasses, setSubclasses] = useState([]);
  const isEditing = !!eventToEdit;
  const isSchedulingFromClient = !!clientForScheduling;

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const data = await getServiceCategories();
          setServiceCategories(data);
        } catch (error) {
          console.error("Erro ao buscar categorias de serviço:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStep(1);
    const initialData = {
      clientName: clientForScheduling?.name || eventToEdit?.clientName || '',
      clientPhone: clientForScheduling?.phone || eventToEdit?.clientPhone || '',
      serviceClass: eventToEdit?.serviceClass || '',
      serviceSubclass: eventToEdit?.serviceSubclass || '',
      price: eventToEdit?.price || '',
      paymentStatus: eventToEdit?.paymentStatus || 'Pendente',
      date: eventToEdit?.start || selectedDate || new Date().toISOString().split('T')[0]
    };
    setFormData(initialData);

    if (initialData.serviceClass && serviceCategories.length > 0) {
        const category = serviceCategories.find(c => c.name === initialData.serviceClass);
        if(category) setSubclasses(category.subclasses);
    }

  }, [isOpen, eventToEdit, clientForScheduling, serviceCategories, selectedDate]);

  const handleClassChange = (e) => {
    const className = e.target.value;
    const category = serviceCategories.find(c => c.name === className);
    const newSubclasses = category ? category.subclasses : [];
    setSubclasses(newSubclasses);
    setFormData(prev => ({ 
        ...prev, 
        serviceClass: className, 
        serviceSubclass: newSubclasses.length > 0 ? newSubclasses[0] : '' 
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
        if (!formData.serviceClass || !formData.serviceSubclass) {
            alert('Por favor, selecione a categoria e o tipo de serviço para continuar.');
            return;
        }
    }
    if (currentStep === 2) {
        if (!formData.clientName || !formData.clientPhone || !formData.price) {
            alert('Por favor, preencha o nome, telefone e valor para continuar.');
            return;
        }
    }
    setCurrentStep(p => p + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalEventData = {
      ...formData,
      title: `${formData.serviceSubclass} - ${formData.clientName}`,
      start: formData.date,
      allDay: true,
    };
    onSave(finalEventData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button type="button" className="close-modal-button" onClick={onClose}><X size={24} /></button>
        <h2 className="modal-title">{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
        <ProgressBar currentStep={currentStep} />

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <fieldset className="form-section">
                <div className="form-group">
                    <label htmlFor="serviceClass">Categoria do Serviço</label>
                    <select id="serviceClass" name="serviceClass" value={formData.serviceClass} onChange={handleClassChange} required>
                        <option value="">Selecione a categoria...</option>
                        {serviceCategories.map(cat => <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="serviceSubclass">Tipo de Serviço</label>
                    <select id="serviceSubclass" name="serviceSubclass" value={formData.serviceSubclass} onChange={handleChange} required disabled={!formData.serviceClass}>
                        <option value="">Selecione o tipo...</option>
                        {subclasses.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </fieldset>
          )}
          
          {currentStep === 2 && (
            <fieldset className="form-section">
                <div className="form-group">
                    <label htmlFor="clientName">Nome do Cliente</label>
                    <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} required disabled={isSchedulingFromClient && isEditing} />
                </div>
                <div className="form-group">
                    <label htmlFor="clientPhone">Telefone</label>
                    <input type="tel" id="clientPhone" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required disabled={isSchedulingFromClient && isEditing}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Valor (R$)</label>
                    <input type="number" step="0.01" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Ex: 70.00" required/>
                </div>
                 {!isEditing && (
                    <div className="form-group">
                        <label htmlFor="date">Data do Agendamento</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                )}
            </fieldset>
          )}

          {currentStep === 3 && (
             <div className="details-section">
                <h3>Revise e Confirme</h3>
                <div className="detail-item"><strong>Data:</strong> {new Date(formData.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                <div className="detail-item"><strong>Cliente:</strong> {formData.clientName}</div>
                <div className="detail-item"><strong>Serviço:</strong> {formData.serviceClass} - {formData.serviceSubclass}</div>
                <div className="detail-item"><strong>Valor:</strong> R$ {parseFloat(formData.price || 0).toFixed(2).replace('.', ',')}</div>
              </div>
          )}

          <div className="step-navigation">
            {currentStep > 1 && <button type="button" className="modal-button secondary" onClick={() => setCurrentStep(p => p - 1)}>Voltar</button>}
            {currentStep < 3 ? (
              <button type="button" className="modal-button primary" onClick={handleNextStep} style={{marginLeft: 'auto'}}>Avançar</button>
            ) : (
              <button type="submit" className="modal-button primary" style={{marginLeft: 'auto'}}>{isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulingModal;
