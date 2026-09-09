import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomMonthPicker = ({ value, onChange, placeholder = "Select Month & Year", alignRight = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const initialYear = value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(initialYear);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      const [year] = value.split('-');
      if (year) setCurrentYear(parseInt(year, 10));
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

  const handleMonthClick = (monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, '0');
    onChange(`${currentYear}-${month}`);
    setIsOpen(false);
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return placeholder;
    const [year, month] = dateStr.split('-');
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${monthName} ${year}`;
  };

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
          width: '100%',
          boxSizing: 'border-box'
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
          width: '260px',
          boxSizing: 'border-box'
        }}>
          {/* Header for Year selection */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button type="button" onClick={() => setCurrentYear(y => y - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '4px' }}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
              {currentYear}
            </span>
            <button type="button" onClick={() => setCurrentYear(y => y + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '4px' }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Grid of Months */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {monthNames.map((month, idx) => {
              const isSelected = value === `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
              const isCurrentMonth = new Date().getFullYear() === currentYear && new Date().getMonth() === idx;

              return (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthClick(idx)}
                  style={{
                    padding: '10px 0',
                    borderRadius: '8px',
                    border: 'none',
                    background: isSelected ? '#1d4ed8' : (isCurrentMonth ? '#eff6ff' : 'transparent'),
                    color: isSelected ? 'white' : (isCurrentMonth ? '#1d4ed8' : '#334155'),
                    fontWeight: isSelected || isCurrentMonth ? '600' : '500',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.target.style.background = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.target.style.background = isCurrentMonth ? '#eff6ff' : 'transparent';
                  }}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMonthPicker;
