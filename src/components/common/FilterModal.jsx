import React, { useState } from 'react';
import { Filter, X, Trash2, RotateCcw, Info } from 'lucide-react';
import Button from './Button';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  title = "Filters", 
  description = "Refine your data by applying specific filters below.", 
  icon: Icon = Filter,
  filters = [],
  showQuickRange = false,
  appliedFilters = [],
  infoTip,
  onApply,
  onReset,
  onClearAll,
  onRemoveFilter
}) => {
  const [activeRange, setActiveRange] = useState('This Month');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="filter-modal-content">
        
        {/* Header */}
        <div className="filter-modal-header">
          <div className="filter-modal-header-left">
            <div className="modal-icon-container" style={{ background: '#eff6ff', color: '#1d4ed8', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={24} />
            </div>
            <div>
              <h3 className="modal-title" style={{ textAlign: 'left', margin: '0 0 4px 0', fontSize: '18px' }}>{title}</h3>
              <p className="modal-desc" style={{ textAlign: 'left', margin: 0, color: '#64748b' }}>
                {description}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="filter-modal-body">
          {filters.length > 0 && (
            <div className="filter-grid-2">
              {filters.map((filter, idx) => (
                <div className="filter-item" key={idx}>
                  <div className="filter-label-wrap">
                    {filter.icon && <filter.icon size={16} className="filter-label-icon" />}
                    <span>{filter.label}</span>
                  </div>
                  
                  {filter.type === 'range' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CustomDatePicker 
                        value={filter.value.start} 
                        onChange={(val) => filter.onChange({ ...filter.value, start: val })} 
                        placeholder="Start Date"
                      />
                      <span style={{ color: '#94a3b8' }}>→</span>
                      <CustomDatePicker 
                        value={filter.value.end} 
                        onChange={(val) => filter.onChange({ ...filter.value, end: val })} 
                        placeholder="End Date"
                        alignRight={true}
                      />
                    </div>
                  ) : filter.type === 'text' ? (
                    <div style={{ position: 'relative' }}>
                      {filter.inputIcon && <filter.inputIcon size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />}
                      <input 
                        type="text" 
                        placeholder={filter.placeholder}
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: filter.inputIcon ? '36px' : '12px' }}
                      />
                    </div>
                  ) : (
                    <CustomSelect 
                      options={filter.options} 
                      value={filter.value} 
                      onChange={filter.onChange} 
                    />
                  )}
                  
                  {filter.desc && <p className="filter-desc">{filter.desc}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Quick Range */}
          {showQuickRange && (
            <>
              <h4 className="filter-section-title">Quick Range</h4>
              <div className="quick-range-wrapper">
                {['Today', 'This Week', 'This Month', 'Last Month', 'This Quarter', 'This Year', 'Custom'].map(range => (
                  <button 
                    key={range}
                    className={`quick-range-btn ${activeRange === range ? 'active' : ''}`}
                    onClick={() => setActiveRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <div className="applied-filters-box">
              <div className="applied-filters-header">
                <div className="applied-filters-title">
                  <Filter size={16} />
                  <span>Applied Filters</span>
                </div>
                <button className="btn-clear-all" onClick={onClearAll}>
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>
              <div className="filter-tags-wrapper">
                {appliedFilters.map((tag, idx) => (
                  <div className="filter-tag" key={idx}>
                    <span className="filter-tag-label">{tag.label}: {tag.value}</span>
                    <span className="filter-tag-close" onClick={() => onRemoveFilter && onRemoveFilter(tag)}>
                      <X size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Tip */}
          {infoTip && (
            <div className="info-alert-blue" style={{ marginTop: '24px', display: 'flex', gap: '8px', padding: '12px 16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <Info size={16} color="#1d4ed8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#1e3a8a' }}>{infoTip}</span>
            </div>
          )}
          
        </div>

        {/* Footer Actions */}
        <div className="filter-modal-actions" style={{ justifyContent: 'flex-end' }}>
          <div className="filter-modal-actions-right">
            <Button variant="outline" icon={<RotateCcw size={16} />} onClick={onReset}>
              Reset Filters
            </Button>
            <Button variant="primary" icon={<Filter size={16} />} onClick={onApply || onClose}>
              Apply Filters
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterModal;
