import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CustomCalendar from '../components/CustomCalendar';
import SchedulingModal from '../components/SchedulingModal';
import SchedulingDetailsModal from '../components/SchedulingDetailsModal';
import { getSchedules, addSchedule, deleteSchedule, updateSchedule } from '../services/firestoreService';

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const year = new Date().getFullYear();
      try {
        const response = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${year}`);
        setHolidays(response.data.map(holiday => holiday.date));
      } catch (error) { console.error("Erro ao carregar feriados:", error); }

      try {
        const schedulesData = await getSchedules();
        setEvents(schedulesData);
      } catch (error) { console.error("Erro ao carregar agendamentos:", error); }
    };
    fetchData();
  }, []);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
        if (event && typeof event.start === 'string') {
            const date = event.start.split('T')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
        }
        return acc;
    }, {});
  }, [events]);

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
    setEditingEvent(null);
  };

  const handleDateClick = (dateStr) => {
    const eventsForDay = eventsByDate[dateStr];
    if (eventsForDay && eventsForDay.length > 0) {
      setSelectedEvent(eventsForDay[0]);
      setIsDetailsModalOpen(true);
    } else {
      setSelectedDate(dateStr);
      setIsCreateModalOpen(true);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Tem certeza que deseja excluir este agendamento?")) return;
    try {
      await deleteSchedule(eventId);
      setEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
      handleCloseModals();
    } catch (error) { console.error("Erro ao excluir agendamento:", error); }
  };

  const handleStartEdit = (eventToEdit) => {
    setEditingEvent(eventToEdit);
    setIsCreateModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await updateSchedule(editingEvent.id, eventData);
        setEvents(currentEvents => 
          currentEvents.map(event => 
            event.id === editingEvent.id ? { id: event.id, ...eventData } : event
          )
        );
      } else {
        const newScheduleId = await addSchedule(eventData);
        setEvents(currentEvents => [...currentEvents, { ...eventData, id: newScheduleId }]);
      }
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
    handleCloseModals();
  };

  return (
    <>
      <CustomCalendar 
        onDateClick={handleDateClick}
        holidays={holidays} 
        events={events}
      />

      <SchedulingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveEvent}
        selectedDate={editingEvent ? editingEvent.start : selectedDate}
        eventToEdit={editingEvent}
      />

      {selectedEvent && (
        <SchedulingDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={handleCloseModals}
            onDelete={handleDeleteEvent}
            onEdit={handleStartEdit}
            event={selectedEvent}
        />
      )}
    </>
  );
};

export default Agenda;
