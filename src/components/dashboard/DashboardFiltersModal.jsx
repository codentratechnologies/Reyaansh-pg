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
        { value: 'Co-living', label: 'Co-living' }
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
      label: 'Month & Year',
      icon: Calendar,
      type: 'month',
      value: filters.year && filters.month ? `${filters.year}-${filters.month.toString().padStart(2, '0')}` : '',
      onChange: (val) => {
        if (val) {
          const [y, m] = val.split('-');
          handleChange('year', y);
          handleChange('month', parseInt(m, 10).toString());
        } else {
          handleChange('year', '');
          handleChange('month', '');
        }
      },
      desc: 'Filters metrics for a specific month and year.'
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
