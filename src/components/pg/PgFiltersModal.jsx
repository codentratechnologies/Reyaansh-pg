import React from 'react';
import { Building2, Hash, User, CheckCircle2, MapPin, Map } from 'lucide-react';
import FilterModal from '../common/FilterModal';

const PgFiltersModal = ({ isOpen, onClose }) => {
  const pgFilters = [
    {
      label: 'Property Type',
      icon: Building2,
      options: [{ value: 'All', label: 'All' }],
      value: 'All',
      onChange: () => {},
      desc: 'Segregates by structural business model.'
    },
    {
      label: 'Gender Type',
      icon: User,
      options: [{ value: 'All', label: 'All' }],
      value: 'All',
      onChange: () => {},
      desc: 'Filters properties catering to specific demographics.'
    },
    {
      label: 'Property Status',
      icon: CheckCircle2,
      options: [{ value: 'Active', label: 'Active' }],
      value: 'Active',
      onChange: () => {},
      desc: 'Hides or shows non-operational properties.'
    },
    {
      label: 'City',
      icon: MapPin,
      options: [{ value: 'All Cities', label: 'All Cities' }],
      value: 'All Cities',
      onChange: () => {},
      desc: 'Filters properties by geographical city.'
    },
    {
      label: 'State',
      icon: Map,
      options: [{ value: 'All States', label: 'All States' }],
      value: 'All States',
      onChange: () => {},
      desc: 'Filters properties by geographical state.'
    }
  ];

  // Dummy applied filters for demonstration
  const appliedFilters = [
    { label: 'Property Status', value: 'Active' },
    { label: 'City', value: 'All Cities' }
  ];

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter PG List"
      description="Apply filters to narrow down your PG records."
      filters={pgFilters}
      appliedFilters={appliedFilters}
      onApply={onClose}
      onReset={() => console.log('Reset PG Filters')}
      onClearAll={() => console.log('Clear All Filters')}
    />
  );
};

export default PgFiltersModal;
