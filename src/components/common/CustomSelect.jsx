import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import '../../assets/dashboard.css';

const CustomSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...',
  icon: Icon,
  className = '',
  error = false,
  searchable,
  searchPlaceholder = 'Search...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = useMemo(() => {
    return options.find(opt => String(opt.value) === String(value));
  }, [options, value]);

  // Dropdowns with 5+ options automatically become searchable unless explicitly toggled
  const isSearchable = searchable !== undefined ? Boolean(searchable) : options.length >= 5;

  // Auto-detect direction (up vs down) with safe viewport clearance
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 250 && rect.top > 350) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Focus search input when opened & reset search when closed
  useEffect(() => {
    if (isOpen) {
      if (isSearchable) {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 50);
      }
    } else {
      setSearchTerm('');
    }
  }, [isOpen, isSearchable]);

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

  // Search filtering logic
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !searchTerm.trim()) return options;
    const lowerSearch = searchTerm.trim().toLowerCase();
    return options.filter(opt => 
      String(opt.label).toLowerCase().includes(lowerSearch) ||
      String(opt.value).toLowerCase().includes(lowerSearch)
    );
  }, [options, isSearchable, searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault();
      onChange(filteredOptions[0].value);
      setIsOpen(false);
    }
  };

  const hasError = error || className.includes('error');

  return (
    <div className={`custom-select-container ${className} ${isOpen ? 'is-open' : ''}`} ref={dropdownRef}>
      <div 
        className={`custom-select-trigger form-input ${isOpen ? 'open' : ''} ${hasError ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <div className="custom-select-value">
          {Icon && <span className="custom-select-icon"><Icon size={16} /></span>}
          {selectedOption?.icon && <span className="custom-select-icon">{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : <span className="placeholder">{placeholder}</span>}
        </div>
        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </div>
      
      {isOpen && (
        <div className={`custom-select-dropdown ${openUpward ? 'open-up' : 'open-down'}`}>
          {isSearchable && (
            <div className="custom-select-search">
              <Search size={14} className="search-icon" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="search-clear-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
          <div className="custom-select-options-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`custom-select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.icon && <span className="custom-select-icon">{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
              ))
            ) : (
              <div className="custom-select-no-results">
                No matching options found{searchTerm ? ` for "${searchTerm}"` : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
