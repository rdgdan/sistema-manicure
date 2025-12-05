import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ onDateClick, holidays = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // CORREÇÃO: A função foi movida para ANTES do useEffect e envolvida em useCallback
  // para estabilidade e para corrigir o erro de linter.
  const generateCalendarDays = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];

    // Dias do mês anterior
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth; i > 0; i--) {
      daysArray.push({ day: prevMonthDays - i + 1, month: 'prev', date: new Date(year, month - 1, prevMonthDays - i + 1) });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, month: 'current', date: new Date(year, month, i) });
    }

    // A lógica original de 42 células (6 semanas) é mantida para garantir que
    // todos os meses caibam sem quebrar a UI, mas o CSS vai torná-la compacta.
    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({ day: i, month: 'next', date: new Date(year, month + 1, i) });
    }

    setDays(daysArray);
  }, []); // useCallback sem dependências, pois a lógica é pura.

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, holidays, generateCalendarDays]);


  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isHoliday = (date) => {
      return holidays.some(h => {
          const holidayDate = new Date(h.start + 'T00:00:00'); // Garante que a data é local
          return holidayDate.getDate() === date.getDate() &&
                 holidayDate.getMonth() === date.getMonth() &&
                 holidayDate.getFullYear() === date.getFullYear();
      });
  };

  const formatDateForId = (date) => {
      return date.toISOString().split('T')[0];
  }

  return (
    <div className="aurora-calendar">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="nav-buttons">
          <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="calendar-grid">
        {weekdays.map(day => <div key={day} className="weekday-header">{day}</div>)}
        {days.map((dayInfo, index) => (
          <div
            key={index}
            className={`day-cell ${dayInfo.month !== 'current' ? 'not-current-month' : ''} ${isToday(dayInfo.date) ? 'today' : ''} ${isHoliday(dayInfo.date) ? 'holiday-background' : ''}`}
            onClick={() => onDateClick(formatDateForId(dayInfo.date))}
          >
            <div className="day-number">{dayInfo.day}</div>
            <div className="events-container">
                {/* Adicionar pontos de eventos aqui se necessário */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
