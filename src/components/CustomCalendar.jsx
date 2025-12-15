import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ onDateClick, holidays = [], events = [] }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const formatDateForId = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth; i > 0; i--) {
      daysArray.push({ day: prevMonthDays - i + 1, month: 'prev', date: new Date(year, month - 1, prevMonthDays - i + 1) });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({ day: i, month: 'current', date: new Date(year, month, i) });
    }

    const remainingCells = 42 - daysArray.length;
    for (let i = 1; i <= remainingCells; i++) {
      daysArray.push({ day: i, month: 'next', date: new Date(year, month + 1, i) });
    }

    return daysArray;

  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
        if (event && typeof event.start === 'string') {
            const date = event.start.split('T')[0];
            acc[date] = true;
        }
        return acc;
    }, {});
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayClassName = (dayInfo) => {
    const classes = ['day-cell'];
    const today = new Date();
    const dateStr = formatDateForId(dayInfo.date);
    const dayOfWeek = dayInfo.date.getDay();

    if (dayInfo.month !== 'current') classes.push('not-current-month');
    if (holidays.includes(dateStr)) classes.push('holiday-day');
    if (dayOfWeek === 0 || dayOfWeek === 6) classes.push('weekend-day');
    if (formatDateForId(dayInfo.date) === formatDateForId(today)) classes.push('today');
    if (eventsByDate[dateStr]) classes.push('has-events'); // Classe invisível

    return classes.join(' ');
  };

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
        {days.map((dayInfo, index) => {
          const dateStr = formatDateForId(dayInfo.date);
          return (
            <div
              key={index}
              className={getDayClassName(dayInfo)}
              onClick={() => dayInfo.month === 'current' && onDateClick(dateStr)}
            >
              <div className="day-number">{dayInfo.day}</div>
              {/* SEM BOLINHAS. LIMPO. MINIMALISTA. */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
