import React, { useState, useEffect } from 'react';
import CustomCalendar from '../components/CustomCalendar';
import SchedulingModal from '../components/SchedulingModal';
// import './Agenda.css'; // REMOVIDO: O CSS de layout foi eliminado

const Agenda = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]); // Para futuros eventos do usuário

  useEffect(() => {
    const fetchHolidays = async () => {
      const year = new Date().getFullYear();
      try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        if (!response.ok) throw new Error('Falha ao buscar feriados.');
        const holidayData = await response.json();

        const holidayEvents = holidayData.map(holiday => ({
          title: holiday.name,
          start: holiday.date,
          allDay: true,
        }));

        setHolidays(holidayEvents);
      } catch (error) {
        console.error("Erro ao carregar feriados:", error);
      }
    };

    fetchHolidays();
  }, []);

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSaveEvent = (newEvent) => {
    setEvents(currentEvents => [...currentEvents, newEvent]);
    handleCloseModal();
  };

  return (
    // REMOVIDO: O div .agenda-container foi eliminado. O calendário agora é responsável por si mesmo.
    <>
      <CustomCalendar 
        onDateClick={handleDateClick} 
        holidays={holidays} 
        events={events}
      />

      <SchedulingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default Agenda;
