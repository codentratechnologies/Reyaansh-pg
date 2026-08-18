import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import { 
  ChevronRight, 
  ArrowLeft,
  FileText,
  MapPin,
  Building,
  ListChecks,
  Search,
  IndianRupee,
  Wifi,
  Brush,
  Droplet,
  Camera,
  UtensilsCrossed,
  Wind,
  Car,
  ChefHat,
  Building2,
  Save,
  Snowflake,
  Monitor,
  X,
  ChevronDown,
  ChevronUp,
  DoorOpen
} from 'lucide-react';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import '../../assets/dashboard.css';
import api from '../../utils/api';

const AddPg = () => {
  const navigate = useNavigate();

  // Basic Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'PG',
    genderType: 'Boys',
    contact_person: '',
    mobile: '',
    description: '',
    address_line_1: '',
    address_line_2: '',
    area: '',
    landmark: '',
    city: '',
    state: '',
    country: 'IN',
    pincode: '',
    propertyStatus: 'Active',
    amenities: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Room configuration state
  const [numRooms, setNumRooms] = useState('');
  const [rooms, setRooms] = useState([]);
  const [expandedRooms, setExpandedRooms] = useState({});

  // When number of rooms changes, regenerate room array
  const handleNumRoomsChange = (val) => {
    const count = parseInt(val) || 0;
    setNumRooms(val);
    if (count > 0 && count <= 999) {
      setRooms(Array.from({ length: count }, () => ({
        roomNo: '',
        sharing: '',
        rent: '',
        bhk: ''
      })));
      // Expand first room by default
      setExpandedRooms({ 0: true });
    } else {
      setRooms([]);
      setExpandedRooms({});
    }
  };

  const toggleRoom = (index) => {
    setExpandedRooms(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const updateRoom = (index, field, value) => {
    setRooms(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // If country changes, clear state and city
      if (field === 'country') {
        newData.state = '';
        newData.city = '';
      }
      // If state changes, clear city
      if (field === 'state') {
        newData.city = '';
      }
      return newData;
    });
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const isSelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: isSelected 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        name: formData.name,
        pg_type: formData.type,
        living_type: formData.genderType,
        contact_person: formData.contact_person,
        mobile: formData.mobile,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        area: formData.area,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        description: formData.description,
        no_of_rooms: parseInt(numRooms) || 0,
        property_status: formData.propertyStatus === 'Active',
        amenities: formData.amenities,
        room_config: rooms.map(r => ({
          room_number: r.roomNo,
          sharing: parseInt(r.sharing) || 1,
          rent: parseFloat(r.rent) || 0,
          bhk: r.bhk ? parseInt(r.bhk) : undefined
        }))
      };

      await api.post('/api/addpg/', payload);
      navigate('/pg-management');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message || "Failed to create PG property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options for Custom Selects
  const typeOptions = [
    { value: 'PG', label: 'PG' },
    { value: 'Apartment', label: 'Apartment' }
  ];

  const genderOptions = [
    { value: 'Boys', label: 'Boys' },
    { value: 'Girls', label: 'Girls' },
    { value: 'Family', label: 'Family' }
  ];

  // Dynamic Location Options
  const countryOptions = Country.getAllCountries().map(country => ({
    value: country.isoCode,
    label: `${country.flag} ${country.name}`
  }));

  const stateOptions = State.getStatesOfCountry(formData.country).map(state => ({
    value: state.isoCode,
    label: state.name
  }));

  const cityOptions = City.getCitiesOfState(formData.country, formData.state).map(city => ({
    value: city.name,
    label: city.name
  }));

  const statusOptions = [
    { 
      value: 'Active', 
      label: 'Active', 
      icon: <div style={{width: 8, height: 8, borderRadius: '50%', background: '#22c55e'}}></div> 
    },
    { 
      value: 'Inactive', 
      label: 'Inactive', 
      icon: <div style={{width: 8, height: 8, borderRadius: '50%', background: '#ef4444'}}></div> 
    }
  ];

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-link">PG Management</span>
        <ChevronRight size={14} className="crumb-separator" />
        <span className="crumb-current">Add New PG</span>
      </div>

      <div className="page-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <div className="step-indicator-wrapper">
          <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span>PG Configuration</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span>Room Configuration</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <>
          {/* Basic Information Card */}
      <div className="form-section-card theme-blue">
        <div className="form-section-header">
          <div className="form-section-icon bg-blue">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Basic Information</h2>
            <p className="form-section-subtitle">Provide basic details about the property.</p>
          </div>
        </div>

        <div className="form-section-body">
          <div className="form-grid-4">
          {error && (
            <div style={{ gridColumn: '1 / -1', backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca', marginBottom: '16px' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Name <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter name (Max 100 chars)" value={formData.name} onChange={(e) => handleTextChange('name', e.target.value)} />
            <span className="form-helper-text">Alphanumeric with spaces</span>
          </div>
          <div className="form-group">
            <label className="form-label">Type <span className="required">*</span></label>
            <CustomSelect 
              options={typeOptions}
              value={formData.type}
              onChange={(val) => handleSelectChange('type', val)}
              placeholder="Select type"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender Type <span className="required">*</span></label>
            <CustomSelect 
              options={genderOptions}
              value={formData.genderType}
              onChange={(val) => handleSelectChange('genderType', val)}
              placeholder="Select gender type"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Person <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter contact person (Max 100 chars)" value={formData.contact_person} onChange={(e) => handleTextChange('contact_person', e.target.value)} />
            <span className="form-helper-text">Alphabetic characters and spaces only</span>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter mobile (10 digits)" value={formData.mobile} onChange={(e) => handleTextChange('mobile', e.target.value)} />
            <span className="form-helper-text">Exactly 10 digits</span>
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">Description</label>
            <div className="textarea-wrapper">
              <textarea 
                className="form-textarea" 
                placeholder="Enter description (Max 500 chars)"
                value={formData.description}
                onChange={(e) => handleTextChange('description', e.target.value)}
                maxLength={500}
              ></textarea>
              <span className="char-counter">{formData.description.length} / 500</span>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Address Information Card */}
      <div className="form-section-card theme-green">
        <div className="form-section-header">
          <div className="form-section-icon bg-green">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Address Information</h2>
            <p className="form-section-subtitle">Enter the address details of the property.</p>
          </div>
        </div>

        <div className="form-section-body">
          <div className="form-grid-4">
          <div className="form-group">
            <label className="form-label">Address Line 1 <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter address line 1 (Max 255 chars)" value={formData.address_line_1} onChange={(e) => handleTextChange('address_line_1', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Address Line 2</label>
            <input type="text" className="form-input" placeholder="Enter address line 2 (Max 255 chars)" value={formData.address_line_2} onChange={(e) => handleTextChange('address_line_2', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Area <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter area (Max 100 chars)" value={formData.area} onChange={(e) => handleTextChange('area', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Landmark</label>
            <input type="text" className="form-input" placeholder="Enter landmark (Max 100 chars)" value={formData.landmark} onChange={(e) => handleTextChange('landmark', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">City <span className="required">*</span></label>
            <CustomSelect 
              options={cityOptions}
              value={formData.city}
              onChange={(val) => handleSelectChange('city', val)}
              placeholder="Select city"
              icon={Building}
              className="input-with-icon"
            />
          </div>
          <div className="form-group">
            <label className="form-label">State <span className="required">*</span></label>
            <CustomSelect 
              options={stateOptions}
              value={formData.state}
              onChange={(val) => handleSelectChange('state', val)}
              placeholder="Select state"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Pincode <span className="required">*</span></label>
            <input type="text" className="form-input" placeholder="Enter pincode (6 digits)" value={formData.pincode} onChange={(e) => handleTextChange('pincode', e.target.value)} />
            <span className="form-helper-text">Exactly 6 digits</span>
          </div>
          <div className="form-group">
            <label className="form-label">Country <span className="required">*</span></label>
            <CustomSelect 
              options={countryOptions}
              value={formData.country}
              onChange={(val) => handleSelectChange('country', val)}
              placeholder="Select country"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Property Configuration Card */}
      <div className="form-section-card theme-purple">
        <div className="form-section-header">
          <div className="form-section-icon bg-purple">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Property Configuration</h2>
            <p className="form-section-subtitle">Set the property capacity and pricing details.</p>
          </div>
        </div>

        <div className="form-section-body">
          <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">No. of Rooms / Flats <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Search size={16} /></div>
              <input 
                type="number" 
                className="form-input pl-10" 
                placeholder="Enter number of rooms/flats"
                value={numRooms}
                min="1"
                max="999"
                onChange={(e) => handleNumRoomsChange(e.target.value)}
                onWheel={(e) => e.target.blur()}
              />
            </div>
            <span className="form-helper-text">Positive integer (Max 999)</span>
          </div>
          <div className="form-group">
            <label className="form-label">Property Status <span className="required">*</span></label>
            <CustomSelect 
              options={statusOptions}
              value={formData.propertyStatus}
              onChange={(val) => handleSelectChange('propertyStatus', val)}
            />
          </div>
        </div>
        </div>
      </div>

      {/* Amenities Card */}
      <div className="form-section-card theme-orange">
        <div className="form-section-header">
          <div className="form-section-icon bg-orange">
            <ListChecks size={20} />
          </div>
          <div>
            <h2 className="form-section-title">Amenities</h2>
            <p className="form-section-subtitle">Select all amenities available at this property.</p>
          </div>
        </div>

        <div className="form-section-body">
          <div className="amenities-grid">
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('WiFi')} onChange={() => handleAmenityToggle('WiFi')} />
            <span className="amenity-icon"><Wifi size={18} /></span>
            <span className="amenity-label">WiFi</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('RO Water')} onChange={() => handleAmenityToggle('RO Water')} />
            <span className="amenity-icon"><Droplet size={18} /></span>
            <span className="amenity-label">RO Water</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Washing Machine')} onChange={() => handleAmenityToggle('Washing Machine')} />
            <span className="amenity-icon"><Wind size={18} /></span>
            <span className="amenity-label">Washing Machine</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Refrigerator')} onChange={() => handleAmenityToggle('Refrigerator')} />
            <span className="amenity-icon"><Snowflake size={18} /></span>
            <span className="amenity-label">Refrigerator</span>
          </label>
          
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('TV')} onChange={() => handleAmenityToggle('TV')} />
            <span className="amenity-icon"><Monitor size={18} /></span>
            <span className="amenity-label">TV</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('CCTV')} onChange={() => handleAmenityToggle('CCTV')} />
            <span className="amenity-icon"><Camera size={18} /></span>
            <span className="amenity-label">CCTV</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Parking')} onChange={() => handleAmenityToggle('Parking')} />
            <span className="amenity-icon"><Car size={18} /></span>
            <span className="amenity-label">Parking</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Lift')} onChange={() => handleAmenityToggle('Lift')} />
            <span className="amenity-icon"><ArrowLeft size={18} style={{transform: 'rotate(90deg)'}} /></span>
            <span className="amenity-label">Lift</span>
          </label>
          
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('House Keeping')} onChange={() => handleAmenityToggle('House Keeping')} />
            <span className="amenity-icon"><Brush size={18} /></span>
            <span className="amenity-label">House Keeping</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Food')} onChange={() => handleAmenityToggle('Food')} />
            <span className="amenity-icon"><UtensilsCrossed size={18} /></span>
            <span className="amenity-label">Food</span>
          </label>
          <label className="amenity-checkbox">
            <input type="checkbox" checked={formData.amenities.includes('Kitchen Staff')} onChange={() => handleAmenityToggle('Kitchen Staff')} />
            <span className="amenity-icon"><ChefHat size={18} /></span>
            <span className="amenity-label">Kitchen Staff</span>
          </label>
        </div>
        </div>
      </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* Room Configuration Card — shown only when rooms > 0 */}
          {rooms.length > 0 ? (
            <div className="form-section-card theme-purple">
              <div className="form-section-header">
                <div className="form-section-icon bg-purple">
                  <DoorOpen size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="form-section-title">{formData.type === 'Apartment' ? 'Flat Configuration' : 'Room Configuration'}</h2>
                  <p className="form-section-subtitle">Configure details for each of the {rooms.length} {formData.type === 'Apartment' ? 'flat' : 'room'}{rooms.length > 1 ? 's' : ''}.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    onClick={() => setExpandedRooms(Object.fromEntries(rooms.map((_, i) => [i, true])))} 
                    style={{ fontSize: '13px', color: '#6366f1', background: '#e0e7ff', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#c7d2fe'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#e0e7ff'}
                  >Expand All</button>
                  <button 
                    type="button"
                    onClick={() => setExpandedRooms({})}
                    style={{ fontSize: '13px', color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  >Collapse All</button>
                </div>
              </div>

              <div className="form-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {rooms.map((room, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      border: expandedRooms[index] ? '1px solid #818cf8' : '1px solid #e2e8f0', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      background: 'white',
                      boxShadow: expandedRooms[index] ? '0 4px 12px rgba(99, 102, 241, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {/* Collapsible Header */}
                    <button 
                      type="button"
                      onClick={() => toggleRoom(index)}
                      style={{ 
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 20px', background: expandedRooms[index] ? '#eef2ff' : 'white', border: 'none', cursor: 'pointer',
                        borderBottom: expandedRooms[index] ? '1px solid #e0e7ff' : 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => { if (!expandedRooms[index]) e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseOut={(e) => { if (!expandedRooms[index]) e.currentTarget.style.background = 'white'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', 
                          background: expandedRooms[index] ? '#6366f1' : '#f1f5f9', 
                          color: expandedRooms[index] ? 'white' : '#64748b', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: '13px', fontWeight: '700', transition: 'all 0.3s'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>
                            {formData.type === 'Apartment' ? 'Flat' : 'Room'} {index + 1}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b', minHeight: '18px' }}>
                            {room.roomNo ? room.roomNo : 'Not configured'}
                            {room.rent && <span style={{ marginLeft: '8px', color: '#10b981', fontWeight: '600' }}>₹{room.rent}</span>}
                          </span>
                        </div>
                      </div>
                      <span style={{ color: expandedRooms[index] ? '#6366f1' : '#94a3b8', transition: 'transform 0.3s', transform: expandedRooms[index] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown size={18} />
                      </span>
                    </button>

                    {/* Collapsible Body */}
                    <div style={{ 
                      maxHeight: expandedRooms[index] ? '500px' : '0', 
                      opacity: expandedRooms[index] ? 1 : 0, 
                      overflow: 'hidden', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}>
                      <div className="room-fields-grid" style={{ padding: '24px 20px' }}>
                        {formData.type === 'Apartment' ? (
                          <>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '13px' }}>Flat No. <span className="required">*</span></label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="e.g. A-101"
                                value={room.roomNo}
                                onChange={(e) => updateRoom(index, 'roomNo', e.target.value)}
                                style={{ padding: '10px 12px', fontSize: '14px' }}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '13px' }}>BHK <span className="required">*</span></label>
                              <input 
                                type="number" 
                                className="form-input" 
                                placeholder="e.g. 2"
                                min="1" max="10"
                                value={room.bhk || ''}
                                onChange={(e) => updateRoom(index, 'bhk', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                style={{ padding: '10px 12px', fontSize: '14px' }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '13px' }}>Room Number <span className="required">*</span></label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="e.g. A-101"
                                value={room.roomNo}
                                onChange={(e) => updateRoom(index, 'roomNo', e.target.value)}
                                style={{ padding: '10px 12px', fontSize: '14px' }}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '13px' }}>Sharing <span className="required">*</span></label>
                              <input 
                                type="number" 
                                className="form-input" 
                                placeholder="e.g. 2"
                                min="1" max="10"
                                value={room.sharing}
                                onChange={(e) => updateRoom(index, 'sharing', e.target.value)}
                                onWheel={(e) => e.target.blur()}
                                style={{ padding: '10px 12px', fontSize: '14px' }}
                              />
                            </div>
                          </>
                        )}
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: '13px' }}>Rent (₹) <span className="required">*</span></label>
                          <div className="input-with-icon">
                            <div className="input-icon-left" style={{ top: '10px' }}><IndianRupee size={16} /></div>
                            <input 
                              type="text" 
                              className="form-input pl-10" 
                              placeholder="e.g. 8500"
                              value={room.rent}
                              onChange={(e) => updateRoom(index, 'rent', e.target.value)}
                              style={{ padding: '10px 12px 10px 36px', fontSize: '14px' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>No Rooms Configured</h3>
              <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '300px', margin: '0 auto' }}>Please go back to the previous step and enter a valid number of rooms to configure them here.</p>
            </div>
          )}
        </>
      )}

      {/* Bottom Actions */}
      <div className="bottom-actions">
        {currentStep === 1 ? (
          <>
            <Button variant="outline" icon={<X size={16} />} onClick={() => navigate('/pg-management')}>Cancel</Button>
            <Button variant="primary" icon={<ChevronRight size={16} />} onClick={() => setCurrentStep(2)}>Next: Room Configuration</Button>
          </>
        ) : (
          <>
            <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => setCurrentStep(1)} disabled={isSubmitting}>Back</Button>
            <Button variant="primary" icon={<Save size={16} />} onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save PG'}
            </Button>
          </>
        )}
      </div>
      
      {/* Error message at the bottom too in case of failure on step 2 */}
      {error && currentStep === 2 && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca', marginTop: '16px', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AddPg;
