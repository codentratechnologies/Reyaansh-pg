import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import '../../assets/dashboard.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = 'Select date',
  icon: Icon = Calendar,
  className = '',
  error = false,
  minYear = 1940,
  maxYear = new Date().getFullYear()
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);

  // Parse initial or current value (expected format YYYY-MM-DD)
  const initialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return { year: y, month: m - 1, day: d };
    }
    return null;
  }, [value]);

  const [viewYear, setViewYear] = useState(initialDate?.year || 2000);
  const [viewMonth, setViewMonth] = useState(initialDate?.month ?? new Date().getMonth());

  // Update view when value changes
  useEffect(() => {
    if (initialDate) {
      setViewYear(initialDate.year);
      setViewMonth(initialDate.month);
    }
  }, [initialDate]);

  // Position detection (Upward vs Downward) with safe viewport top margin
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const popupHeight = 360;

      // Only open upward if space below is constrained AND top space is abundant (> 400px)
      if (spaceBelow < popupHeight && rect.top > 400) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate Year options (descending e.g. 2026 down to 1940 for quick DOB pick)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = maxYear; y >= minYear; y--) {
      years.push(y);
    }
    return years;
  }, [minYear, maxYear]);

  // Calendar Day Generation
  const daysGrid = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const grid = [];

    // Previous Month Filler Days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      grid.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        month: viewMonth === 0 ? 11 : viewMonth - 1
      });
    }

    // Current Month Days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        day: d,
        isCurrentMonth: true,
        year: viewYear,
        month: viewMonth
      });
    }

    // Next Month Filler Days (to complete 6 rows = 42 cells)
    const remaining = 42 - grid.length;
    for (let d = 1; d <= remaining; d++) {
      grid.push({
        day: d,
        isCurrentMonth: false,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        month: viewMonth === 11 ? 0 : viewMonth + 1
      });
    }

    return grid;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => Math.max(prev - 1, minYear));
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => Math.min(prev + 1, maxYear));
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (cell) => {
    const formattedMonth = String(cell.month + 1).padStart(2, '0');
    const formattedDay = String(cell.day).padStart(2, '0');
    const dateStr = `${cell.year}-${formattedMonth}-${formattedDay}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  // Format display text (e.g. 15 May 1998)
  const displayFormattedDate = useMemo(() => {
    if (!initialDate) return '';
    const { year, month, day } = initialDate;
    const monthName = MONTH_NAMES[month]?.substring(0, 3);
    return `${String(day).padStart(2, '0')} ${monthName} ${year}`;
  }, [initialDate]);

  const hasError = error || className.includes('error');

  return (
    <div 
      className={`custom-datepicker-container ${className} ${isOpen ? 'is-open' : ''}`} 
      ref={containerRef}
    >
      <div 
        className={`custom-select-trigger form-input ${isOpen ? 'open' : ''} ${hasError ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="custom-select-value">
          <span className="custom-select-icon" style={{ color: '#1a56db' }}>
            <Icon size={16} />
          </span>
          {displayFormattedDate ? (
            <span style={{ color: '#0f172a', fontWeight: '500' }}>{displayFormattedDate}</span>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {value && (
            <button 
              type="button" 
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                borderRadius: '50%'
              }}
              title="Clear date"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className={`custom-datepicker-popup ${openUpward ? 'open-up' : 'open-down'}`}>
          {/* Header Controls: Month & Year Selector */}
          <div className="cdp-header">
            <button type="button" className="cdp-nav-btn" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={16} />
            </button>

            <div className="cdp-title-selectors">
              <select 
                value={viewMonth} 
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="cdp-select-month"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>

              <select 
                value={viewYear} 
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="cdp-select-year"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button type="button" className="cdp-nav-btn" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="cdp-body">
            {/* Days of week header */}
            <div className="cdp-weekdays">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="cdp-weekday">{d}</span>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="cdp-days-grid">
              {daysGrid.map((cell, idx) => {
                const isSelected = initialDate && 
                  initialDate.year === cell.year && 
                  initialDate.month === cell.month && 
                  initialDate.day === cell.day;

                const isToday = new Date().getFullYear() === cell.year &&
                  new Date().getMonth() === cell.month &&
                  new Date().getDate() === cell.day;

                return (
                  <button
                    key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                    type="button"
                    className={`cdp-day-btn ${!cell.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleSelectDay(cell)}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Quick Today button */}
          <div className="cdp-footer">
            <button 
              type="button" 
              className="cdp-clear-btn"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
            >
              Clear
            </button>
            <button 
              type="button" 
              className="cdp-today-btn" 
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                onChange(`${year}-${month}-${day}`);
                setIsOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
