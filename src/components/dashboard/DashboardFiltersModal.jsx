import React, { useState, useEffect } from 'react';
import { Building2, User, IndianRupee, Calendar } from 'lucide-react';
import FilterModal from '../common/FilterModal';

const DashboardFiltersModal = ({ isOpen, onClose, activeFilters, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    property_type: '',
    living_type: '',
    member_status: '',
    rent_status: '',
    month: '',
    year: ''
  });

  useEffect(() => {
    if (activeFilters) {
      setFilters(prev => ({ ...prev, ...activeFilters }));
    }
  }, [activeFilters, isOpen]);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const dashboardFilters = [
    {
      label: 'Property Type',
      icon: Building2,
      options: [
        { value: '', label: 'All Property Types' }, 
        { value: 'PG', label: 'PG' },
        { value: 'Apartment', label: 'Apartment' }
      ],
      value: filters.property_type,
      onChange: (val) => handleChange('property_type', val),
      desc: 'Filters data based on the business model type.'
    },
    {
      label: 'Living Type',
      icon: User,
      options: [
        { value: '', label: 'All Living Types' }, 
        { value: 'Boys', label: 'Boys' },
        { value: 'Girls', label: 'Girls' },
        { value: 'Family', label: 'Family' }
      ],
      value: filters.living_type,
      onChange: (val) => handleChange('living_type', val),
      desc: 'Segregates occupancy and revenue by living type.'
    },
    {
      label: 'Member Status',
      icon: User,
      options: [
        { value: '', label: 'All Statuses' }, 
        { value: 'Active', label: 'Active' },
        { value: 'Notice Period', label: 'Notice Period' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      value: filters.member_status,
      onChange: (val) => handleChange('member_status', val),
      desc: 'Narrows down metrics based on current tenant state.'
    },
    {
      label: 'Rent Status',
      icon: IndianRupee,
      options: [
        { value: '', label: 'All Statuses' }, 
        { value: 'Paid', label: 'Paid' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Overdue', label: 'Overdue' }
      ],
      value: filters.rent_status,
      onChange: (val) => handleChange('rent_status', val),
      desc: 'Filters financial figures and lists by collection status.'
    },
    {
      label: 'Month',
      icon: Calendar,
      options: [
        { value: '', label: 'All Months' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
      ],
      value: filters.month,
      onChange: (val) => handleChange('month', val),
      desc: 'Filters monthly recurring metrics.'
    },
    {
      label: 'Year',
      icon: Calendar,
      options: [
        { value: '', label: 'All Years' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' }
      ],
      value: filters.year,
      onChange: (val) => handleChange('year', val),
      desc: 'Filters annual aggregations.'
    }
  ];

  // Map non-empty filters for display in the modal's applied section
  const appliedFiltersList = Object.entries(filters)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => ({
      label: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value
    }));

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      property_type: '',
      living_type: '',
      member_status: '',
      rent_status: '',
      month: '',
      year: ''
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Dashboard Filters"
      description="Refine your dashboard data by applying specific filters below."
      filters={dashboardFilters}
      showQuickRange={false}
      appliedFilters={appliedFiltersList}
      onApply={handleApply}
      onReset={handleReset}
      onClearAll={handleReset}
    />
  );
};

export default DashboardFiltersModal;
