import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import '../../assets/dashboard.css';

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  icon: Icon,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-select-container ${className} ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
      <div 
        className={`custom-select-trigger form-input ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="custom-select-value">
          {Icon && <span className="custom-select-icon"><Icon size={16} /></span>}
          {selectedOption?.icon && <span className="custom-select-icon">{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : <span className="placeholder">{placeholder}</span>}
        </div>
        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <div 
              key={option.value}
              className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.icon && <span className="custom-select-icon">{option.icon}</span>}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
