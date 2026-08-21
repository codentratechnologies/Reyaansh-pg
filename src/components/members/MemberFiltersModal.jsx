import React, { useState, useEffect } from 'react';
import { 
  User, Phone, Building2, DoorClosed, BedDouble, 
  IndianRupee, Users, ShieldCheck, Calendar, MapPin 
} from 'lucide-react';
import FilterModal from '../common/FilterModal';
import api from '../../utils/api';

const MemberFiltersModal = ({ isOpen, onClose, activeFilters, onApplyFilters }) => {
  const [pgOptions, setPgOptions] = useState([{ value: '', label: 'All PGs' }]);
  const [cityOptions, setCityOptions] = useState([{ value: '', label: 'All Cities' }]);
  
  const [filters, setFilters] = useState({
    pg_name: '',
    rent_status: '',
    gender: '',
    member_status: '',
    city: ''
  });

  useEffect(() => {
    if (activeFilters) {
      setFilters(prev => ({ ...prev, ...activeFilters }));
    }
  }, [activeFilters, isOpen]);

  useEffect(() => {
    const fetchPgData = async () => {
      try {
        const response = await api.get('/api/pg/availability');
        const data = response.data?.data || [];
        
        const pgs = data.map(pg => ({ value: pg.pg_name, label: pg.pg_name }));
        const citiesSet = new Set(data.map(pg => pg.city).filter(Boolean));
        const cities = Array.from(citiesSet).map(city => ({ value: city, label: city }));

        setPgOptions([{ value: '', label: 'All PGs' }, ...pgs]);
        setCityOptions([{ value: '', label: 'All Cities' }, ...cities]);
      } catch (error) {
        console.error("Failed to load PG filter data", error);
      }
    };
    fetchPgData();
  }, []);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const memberFilters = [
    {
      label: 'PG Name',
      icon: Building2,
      options: pgOptions,
      value: filters.pg_name,
      onChange: (val) => handleChange('pg_name', val),
      desc: 'Isolates tenants residing in a specific property.'
    },
    {
      label: 'City',
      icon: MapPin,
      options: cityOptions,
      value: filters.city,
      onChange: (val) => handleChange('city', val),
      desc: 'Filters tenants originating from a specific city.'
    },
    {
      label: 'Rent Status',
      icon: IndianRupee,
      options: [
        { value: '', label: 'All Statuses' }, 
        { value: 'Paid', label: 'Paid' }, 
        { value: 'Pending', label: 'Pending' }, 
        { value: 'Overdue', label: 'Overdue' }, 
        { value: 'In Review', label: 'In Review' }
      ],
      value: filters.rent_status,
      onChange: (val) => handleChange('rent_status', val),
      desc: 'Filters members based on their current rent payment status.'
    },
    {
      label: 'Gender',
      icon: Users,
      options: [
        { value: '', label: 'All Genders' },
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ],
      value: filters.gender,
      onChange: (val) => handleChange('gender', val),
      desc: 'Filters tenants by gender.'
    },
    {
      label: 'Member Status',
      icon: ShieldCheck,
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Notice Period', label: 'Notice Period' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      value: filters.member_status,
      onChange: (val) => handleChange('member_status', val),
      desc: 'Filters tenants based on their current residency phase.'
    }
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = { pg_name: '', rent_status: '', gender: '', member_status: '', city: '' };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Members"
      description="Apply filters to find members quickly and efficiently."
      filters={memberFilters}
      showQuickRange={false}
      appliedFilters={[]}
      infoTip="Tip: You can use one or more filters together to narrow down your search results."
      onApply={handleApply}
      onReset={handleReset}
      onClearAll={handleReset}
    />
  );
};

export default MemberFiltersModal;
