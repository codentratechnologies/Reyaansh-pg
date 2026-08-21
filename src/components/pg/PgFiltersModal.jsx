import React, { useState, useEffect } from 'react';
import { Building2, Hash, User, CheckCircle2, MapPin, Map } from 'lucide-react';
import FilterModal from '../common/FilterModal';
import api from '../../utils/api';

const PgFiltersModal = ({ isOpen, onClose, initialFilters, onApply }) => {
  // Local state to hold filter changes before applying
  const [localFilters, setLocalFilters] = useState(initialFilters || {
    property_type: 'All',
    living_type: 'All',
    property_status: 'All',
    state: 'All States',
    city: 'All Cities'
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  // Sync with parent filters when modal opens
  useEffect(() => {
    if (isOpen && initialFilters) {
      setLocalFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  // Fetch States on mount/open
  useEffect(() => {
    if (isOpen && statesList.length === 0) {
      const fetchStates = async () => {
        try {
          const res = await api.get('/api/states/');
          if (Array.isArray(res.data)) {
            setStatesList(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch states", err);
        }
      };
      fetchStates();
    }
  }, [isOpen]);

  // Fetch Cities when state changes or on open
  useEffect(() => {
    if (isOpen) {
      const fetchCities = async () => {
        try {
          const params = {};
          if (localFilters.state !== 'All States') {
            params.state = localFilters.state;
          }
          const res = await api.get('/api/cities/', { params });
          if (Array.isArray(res.data)) {
            setCitiesList(res.data);
          }
        } catch (err) {
          console.error("Failed to fetch cities", err);
        }
      };
      fetchCities();
    }
  }, [isOpen, localFilters.state]);

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => {
      const updated = { ...prev, [key]: value };
      // If state changes, reset city
      if (key === 'state' && prev.state !== value) {
        updated.city = 'All Cities';
      }
      return updated;
    });
  };

  const pgFilters = [
    {
      label: 'PG Type',
      icon: Building2,
      options: [
        { value: 'All', label: 'All' },
        { value: 'PG', label: 'PG' },
        { value: 'Apartment', label: 'Apartment' }
      ],
      value: localFilters.property_type,
      onChange: (val) => handleFilterChange('property_type', val),
      desc: 'Segregates by structural business model.'
    },
    {
      label: 'Living Type',
      icon: User,
      options: [
        { value: 'All', label: 'All' },
        { value: 'Boys', label: 'Boys' },
        { value: 'Girls', label: 'Girls' },
        { value: 'Co-Living', label: 'Co-Living' }
      ],
      value: localFilters.living_type,
      onChange: (val) => handleFilterChange('living_type', val),
      desc: 'Filters properties catering to specific demographics.'
    },
    {
      label: 'Property Status',
      icon: CheckCircle2,
      options: [
        { value: 'All', label: 'All' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      value: localFilters.property_status,
      onChange: (val) => handleFilterChange('property_status', val),
      desc: 'Hides or shows non-operational properties.'
    },
    {
      label: 'State',
      icon: Map,
      options: [
        { value: 'All States', label: 'All States' },
        ...statesList.map(s => ({ value: s, label: s }))
      ],
      value: localFilters.state,
      onChange: (val) => handleFilterChange('state', val),
      desc: 'Filters properties by geographical state.'
    },
    {
      label: 'City',
      icon: MapPin,
      options: [
        { value: 'All Cities', label: 'All Cities' },
        ...citiesList.map(c => ({ value: c, label: c }))
      ],
      value: localFilters.city,
      onChange: (val) => handleFilterChange('city', val),
      desc: 'Filters properties by geographical city.'
    }
  ];

  const handleApply = () => {
    if (onApply) onApply(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const cleared = {
      property_type: 'All',
      living_type: 'All',
      property_status: 'All',
      state: 'All States',
      city: 'All Cities'
    };
    setLocalFilters(cleared);
  };

  // Convert applied filters format for FilterModal (if it needs array)
  const appliedFiltersArray = [];
  if (localFilters.property_type !== 'All') appliedFiltersArray.push({ label: 'PG Type', value: localFilters.property_type });
  if (localFilters.living_type !== 'All') appliedFiltersArray.push({ label: 'Living Type', value: localFilters.living_type });
  if (localFilters.property_status !== 'All') appliedFiltersArray.push({ label: 'Property Status', value: localFilters.property_status });
  if (localFilters.state !== 'All States') appliedFiltersArray.push({ label: 'State', value: localFilters.state });
  if (localFilters.city !== 'All Cities') appliedFiltersArray.push({ label: 'City', value: localFilters.city });

  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter PG List"
      description="Apply filters to narrow down your PG records."
      filters={pgFilters}
      appliedFilters={appliedFiltersArray}
      onApply={handleApply}
      onReset={handleClearAll}
      onClearAll={handleClearAll}
    />
  );
};

export default PgFiltersModal;
