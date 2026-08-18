import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, placeholder = "Select Date", alignRight = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dropdownRef = useRef(null);

  // Initialize currentDate from value if available
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-');
      if (year && month && day) {
        setCurrentDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isSelected = value === `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <button
          key={d}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDateClick(d);
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            background: isSelected ? '#1d4ed8' : (isToday ? '#eff6ff' : 'transparent'),
            color: isSelected ? 'white' : (isToday ? '#1d4ed8' : '#334155'),
            fontWeight: isSelected || isToday ? '600' : '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.target.style.background = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.target.style.background = isToday ? '#eff6ff' : 'transparent';
          }}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return placeholder;
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', flex: 1 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          background: 'white',
          cursor: 'pointer',
          color: value ? '#0f172a' : '#94a3b8',
          fontSize: '14px',
          fontWeight: '500',
          minWidth: '130px'
        }}
      >
        <CalendarIcon size={16} color={value ? '#1d4ed8' : '#94a3b8'} />
        {formatDisplayDate(value)}
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: alignRight ? 'auto' : 0,
          right: alignRight ? 0 : 'auto',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          zIndex: 100,
          width: '260px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button type="button" onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '4px' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button type="button" onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '4px' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of week */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '8px' }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#94a3b8', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
