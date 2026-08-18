import React from 'react';
import { 
  User, Phone, Building2, DoorClosed, BedDouble, 
  IndianRupee, Users, ShieldCheck, Calendar, MapPin 
} from 'lucide-react';
import FilterModal from '../common/FilterModal';

const MemberFiltersModal = ({ isOpen, onClose }) => {
  const memberFilters = [
    {
      label: 'PG Name',
      icon: Building2,
      options: [{ value: 'All PGs', label: 'All PGs' }],
      value: 'All PGs',
      onChange: () => {},
      desc: 'Isolates tenants residing in a specific property.'
    },
    {
      label: 'Rent Status',
      icon: IndianRupee,
      options: [{ value: 'All Statuses', label: 'All Statuses' }, { value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }, { value: 'Overdue', label: 'Overdue' }, { value: 'In Review', label: 'In Review' }],
      value: 'All Statuses',
      onChange: () => {},
      desc: 'Filters members based on their current rent payment status.'
    },
    {
      label: 'Gender',
      icon: Users,
      options: [{ value: 'All Genders', label: 'All Genders' }],
      value: 'All Genders',
      onChange: () => {},
      desc: 'Filters tenants by gender.'
    },
    {
      label: 'Member Status',
      icon: ShieldCheck,
      options: [{ value: 'Active', label: 'Active' }],
      value: 'Active',
      onChange: () => {},
      desc: 'Filters tenants based on their current residency phase.'
    },
    {
      label: 'Joining Date',
      type: 'range',
      icon: Calendar,
      value: { start: '', end: '' },
      onChange: () => {},
      desc: 'Filters members onboarded within a specific period.'
    },
    {
      label: 'City',
      icon: MapPin,
      options: [{ value: 'All Cities', label: 'All Cities' }],
      value: 'All Cities',
      onChange: () => {},
      desc: 'Filters tenants originating from a specific city.'
    }
  ];

  // Dummy applied filters for demonstration
  const appliedFilters = [
    { label: 'PG Name', value: 'Sunshine PG' },
    { label: 'Member Status', value: 'Active' },
    { label: 'Joining Date', value: 'Last 30 Days' }
  ];

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Members"
      description="Apply filters to find members quickly and efficiently."
      filters={memberFilters}
      showQuickRange={true}
      appliedFilters={appliedFilters}
      infoTip="Tip: You can use one or more filters together to narrow down your search results."
      onApply={onClose}
      onReset={() => console.log('Reset Member Filters')}
      onClearAll={() => console.log('Clear All Filters')}
    />
  );
};

export default MemberFiltersModal;
