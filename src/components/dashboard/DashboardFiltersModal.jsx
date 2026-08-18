import React from 'react';
import { Building2, User, IndianRupee, Calendar } from 'lucide-react';
import FilterModal from '../common/FilterModal';

const DashboardFiltersModal = ({ isOpen, onClose }) => {
  // Define filter config array
  const dashboardFilters = [
    {
      label: 'PG',
      icon: Building2,
      options: [{ value: 'All', label: 'All Properties' }, { value: 'PG1', label: 'Sunshine PG' }],
      value: 'All',
      onChange: () => {},
      desc: 'Select a specific property or view all.'
    },
    {
      label: 'Property Type',
      icon: Building2,
      options: [{ value: 'All', label: 'All' }, { value: 'PG', label: 'PG' }],
      value: 'All',
      onChange: () => {},
      desc: 'Filters data based on the business model type.'
    },
    {
      label: 'Gender Type',
      icon: User,
      options: [{ value: 'All', label: 'All' }, { value: 'Male', label: 'Male' }],
      value: 'All',
      onChange: () => {},
      desc: 'Segregates occupancy and revenue by gender.'
    },
    {
      label: 'Member Status',
      icon: User,
      options: [{ value: 'All', label: 'All' }, { value: 'Active', label: 'Active' }],
      value: 'All',
      onChange: () => {},
      desc: 'Narrows down metrics based on current tenant state.'
    },
    {
      label: 'Rent Status',
      icon: IndianRupee,
      options: [{ value: 'All', label: 'All' }, { value: 'Pending', label: 'Pending' }],
      value: 'All',
      onChange: () => {},
      desc: 'Filters financial figures and lists by collection status.'
    },
    {
      label: 'Month',
      icon: Calendar,
      options: [{ value: 'August', label: 'August' }],
      value: 'August',
      onChange: () => {},
      desc: 'Filters monthly recurring metrics.'
    },
    {
      label: 'Year',
      icon: Calendar,
      options: [{ value: '2026', label: '2026' }],
      value: '2026',
      onChange: () => {},
      desc: 'Filters annual aggregations.'
    },
    {
      label: 'Date Range',
      type: 'range',
      icon: Calendar,
      value: { start: '2026-08-01', end: '2026-08-31' },
      onChange: () => {},
      desc: 'Narrows data to a specific operational window.'
    }
  ];

  // Dummy applied filters for the dashboard
  const appliedFilters = [
    { label: 'PG', value: 'Sunshine PG' },
    { label: 'Property Type', value: 'PG' },
    { label: 'Member Status', value: 'Active' },
    { label: 'Rent Status', value: 'Pending' },
    { label: 'Month', value: 'August' },
    { label: 'Year', value: '2026' },
    { label: 'Date Range', value: '01 Aug 2026 - 31 Aug 2026' }
  ];

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Dashboard Filters"
      description="Refine your dashboard data by applying specific filters below."
      filters={dashboardFilters}
      showQuickRange={true}
      appliedFilters={appliedFilters}
      onApply={onClose}
      onReset={() => console.log('Reset Filters')}
      onClearAll={() => console.log('Clear All')}
    />
  );
};

export default DashboardFiltersModal;
