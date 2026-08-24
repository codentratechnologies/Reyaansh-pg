import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import {
  UserPlus, User, Phone, PhoneCall, Mail, Briefcase, Calendar, Building,
  CreditCard, CloudUpload, ShieldAlert, Home, MapPin, Map, Hash,
  BedDouble, Bed, Key, IndianRupee, Clock, ShieldCheck, FileText, ChevronRight,
  ArrowLeft, X, Save
} from 'lucide-react';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import '../../assets/dashboard.css';

import api from '../../utils/api';

const MemberRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Availability Data
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);

  useEffect(() => {
    // Inject PWA Manifest for isolated Add Member app
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/add-member-manifest.json';
    link.id = 'add-member-manifest';
    document.head.appendChild(link);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/add-member-sw.js').then((registration) => {
        console.log('Isolated PWA SW registered:', registration);
      }).catch((error) => {
        console.error('Isolated PWA SW registration failed:', error);
      });
    }

    return () => {
      // Cleanup manifest link when unmounting
      const existingLink = document.getElementById('add-member-manifest');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get('/api/pg/availability');
        if (response.data && Array.isArray(response.data)) {
          setAvailabilityData(response.data);
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          setAvailabilityData(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch PG availability:", err);
      }
    };
    fetchAvailability();
  }, []);

  const [formData, setFormData] = useState({
    memberId: 'Auto-generated',
    fullName: '',
    mobile: '',
    altMobile: '',
    email: '',
    occupation: '',
    dob: '',
    gender: '',
    company: '',

    aadhaarNo: '',
    panNo: '',
    dlNo: '',

    contactPerson: '',
    relationship: '',
    contactNumber: '',

    addressLine1: '',
    addressLine2: '',
    country: 'IN',
    state: '',
    city: '',
    pincode: '',

    pgType: '',
    pgName: '',
    roomNumber: '',
    bed: '',

    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharge: '',
    rentDueDate: '',
    noticePeriod: '',

    status: '',
    reason: ''
  });

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Cascade logic for PG selection
      if (field === 'pgName') {
        updated.roomNumber = '';
        updated.bed = '';
        const selectedPg = availabilityData.find(pg => (pg.pg_id === value || pg.id === value));
        setAvailableRooms(selectedPg?.available_rooms || []);
        setAvailableBeds([]);
      } else if (field === 'roomNumber') {
        updated.bed = '';
        const selectedRoom = availableRooms.find(r => (r.room_id === value || r.room_number === value));
        setAvailableBeds(selectedRoom?.available_beds || []);
      }
      
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        full_name: formData.fullName,
        mobile_number: formData.mobile,
        occupation: formData.occupation,
        dob: formData.dob,
        gender: formData.gender,
        company_college_name: formData.company,
        aadhaar_number: formData.aadhaarNo,
        emergency_contact_name: formData.contactPerson,
        emergency_contact_relationship: formData.relationship,
        emergency_contact_number: formData.contactNumber,
        address_line_1: formData.addressLine1,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
        pg_type: formData.pgType,
        pg_id: formData.pgName,
        room_id: formData.roomNumber,
        monthly_rent: Number(formData.monthlyRent),
        security_deposit: Number(formData.securityDeposit),
        maintenance_charge: Number(formData.maintenanceCharge),
        rent_due_date: formData.rentDueDate,
        notice_period_days: Number(formData.noticePeriod),
        status: formData.status
      };
      
      if (formData.pgType === 'PG') payload.bed_id = formData.bed;
      if (formData.status === 'Notice Period') payload.status_reason = formData.reason;
      if (formData.altMobile) payload.alternate_mobile_number = formData.altMobile;
      if (formData.email) payload.email = formData.email;
      if (formData.panNo) payload.pan_number = formData.panNo;
      if (formData.dlNo) payload.driving_licence_number = formData.dlNo;
      if (formData.addressLine2) payload.address_line_2 = formData.addressLine2;

      await api.post('/api/members', payload);
      navigate('/member-management');
    } catch (err) {
      console.error("Failed to add member:", err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Unknown error";
      setError(`Failed to save member. Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pgTypeOptions = [
    { value: 'PG', label: 'PG' },
    { value: 'Apartment', label: 'Apartment' }
  ];

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const occupationOptions = [
    { value: 'Student', label: 'Student' },
    { value: 'Professional', label: 'Professional' },
    { value: 'Other', label: 'Other' }
  ];

  const relationshipOptions = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' }
  ];

  const dueDaysOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1), label: String(i + 1)
  }));

  const noticePeriodOptions = [
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
    { value: '45', label: '45 Days' },
    { value: '60', label: '60 Days' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  const countryOptions = Country.getAllCountries().map(country => ({
    value: country.isoCode,
    label: country.name
  }));

  const stateOptions = formData.country
    ? State.getStatesOfCountry(formData.country).map(state => ({
      value: state.isoCode,
      label: state.name
    }))
    : [];

  const cityOptions = formData.state
    ? City.getCitiesOfState(formData.country, formData.state).map(city => ({
      value: city.name,
      label: city.name
    }))
    : [];

  const pgOptions = availabilityData.map(pg => ({ value: pg.pg_id || pg.id, label: pg.name || pg.pg_name }));
  const roomOptions = availableRooms.map(r => ({ value: r.room_id || r.id, label: r.room_number || r.flat_no || r.room_name }));
  const bedOptions = availableBeds.map(b => ({ value: b.bed_id || b.id, label: b.bed_name || b.bed_number }));

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      {/* Simple standalone header */}
      <header style={{ backgroundColor: '#ffffff', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '600' }}>Reyaansh PG - Member Registration</h1>
      </header>

      <main style={{ padding: '24px' }}>
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: 0 }}>
      {/* 1. Personal Information */}
      <div className="form-section-card theme-blue">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-blue"><User size={20} /></div>
            <div className="step-badge">1</div>
            <h2 className="form-section-title">Personal Information</h2>
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Member ID <span className="required">*</span></label>
            <div className="input-with-icon disabled">
              <input type="text" className="form-input" value={formData.memberId} disabled />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="Enter full name" value={formData.fullName} onChange={(e) => handleTextChange('fullName', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number <span className="required">*</span></label>
            <div className="input-with-icon">
              <input type="text" className="form-input" placeholder="Enter 10 digit number" value={formData.mobile} onChange={(e) => handleTextChange('mobile', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter alternate number" value={formData.altMobile} onChange={(e) => handleTextChange('altMobile', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Mail size={16} /></div>
              <input type="email" className="form-input pl-10" placeholder="Enter email address" value={formData.email} onChange={(e) => handleTextChange('email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Occupation <span className="required">*</span></label>
            <CustomSelect options={occupationOptions} value={formData.occupation} onChange={(val) => handleSelectChange('occupation', val)} placeholder="Select occupation" />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Calendar size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="DD/MM/YYYY" value={formData.dob} onChange={(e) => handleTextChange('dob', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Gender <span className="required">*</span></label>
            <CustomSelect options={genderOptions} value={formData.gender} onChange={(val) => handleSelectChange('gender', val)} placeholder="Select gender" />
          </div>
          <div className="form-group">
            <label className="form-label">Company / College Name <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Building size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter company / college name" value={formData.company} onChange={(e) => handleTextChange('company', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Identity Verification */}
      <div className="form-section-card theme-green">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-green"><ShieldCheck size={20} /></div>
            <div className="step-badge">2</div>
            <h2 className="form-section-title">Identity Verification</h2>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Aadhaar Card (Number) <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><CreditCard size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter 12 digit Aadhaar no." value={formData.aadhaarNo} onChange={(e) => handleTextChange('aadhaarNo', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PAN <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><CreditCard size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter PAN number" value={formData.panNo} onChange={(e) => handleTextChange('panNo', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Driving Licence <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><FileText size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter DL number" value={formData.dlNo} onChange={(e) => handleTextChange('dlNo', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Emergency Contact */}
      <div className="form-section-card theme-orange">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-orange"><ShieldAlert size={20} /></div>
            <div className="step-badge">3</div>
            <h2 className="form-section-title">Emergency Contact</h2>
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Contact Person Name <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><User size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter contact person name" value={formData.contactPerson} onChange={(e) => handleTextChange('contactPerson', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Relationship <span className="required">*</span></label>
            <CustomSelect options={relationshipOptions} value={formData.relationship} onChange={(val) => handleSelectChange('relationship', val)} placeholder="Select relationship" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter 10 digit number" value={formData.contactNumber} onChange={(e) => handleTextChange('contactNumber', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Address Details */}
      <div className="form-section-card theme-purple">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-purple"><Home size={20} /></div>
            <div className="step-badge">4</div>
            <h2 className="form-section-title">Address Details</h2>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Address Line 1 <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Home size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter address line 1" value={formData.addressLine1} onChange={(e) => handleTextChange('addressLine1', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address Line 2</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><FileText size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter address line 2" value={formData.addressLine2} onChange={(e) => handleTextChange('addressLine2', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="form-grid-3" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Country <span className="required">*</span></label>
            <CustomSelect options={countryOptions} value={formData.country} onChange={(val) => handleSelectChange('country', val)} placeholder="Select country" />
          </div>
          <div className="form-group">
            <label className="form-label">State <span className="required">*</span></label>
            <CustomSelect options={stateOptions} value={formData.state} onChange={(val) => handleSelectChange('state', val)} placeholder="Select state" />
          </div>
          <div className="form-group">
            <label className="form-label">City <span className="required">*</span></label>
            <CustomSelect options={cityOptions} value={formData.city} onChange={(val) => handleSelectChange('city', val)} placeholder="Select city" />
          </div>
          <div className="form-group">
            <label className="form-label">Pincode <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><MapPin size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter 6 digit pincode" value={formData.pincode} onChange={(e) => handleTextChange('pincode', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Stay Details */}
      <div className="form-section-card theme-blue">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-blue"><BedDouble size={20} /></div>
            <div className="step-badge">5</div>
            <h2 className="form-section-title">Stay Details</h2>
          </div>
        </div>

        <div className="form-section-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">PG Type <span className="required">*</span></label>
              <CustomSelect options={pgTypeOptions} value={formData.pgType} onChange={(val) => handleSelectChange('pgType', val)} placeholder="Select type" />
            </div>
            <div className="form-group">
              <label className="form-label">PG Name <span className="required">*</span></label>
              <CustomSelect options={pgOptions} value={formData.pgName} onChange={(val) => handleSelectChange('pgName', val)} placeholder={pgOptions.length ? "Select PG" : "Loading..."} />
            </div>
            <div className="form-group">
              <label className="form-label">Room/Flat Number <span className="required">*</span></label>
              <CustomSelect options={roomOptions} value={formData.roomNumber} onChange={(val) => handleSelectChange('roomNumber', val)} placeholder={roomOptions.length ? "Select room" : "Select PG first"} />
            </div>
            {formData.pgType !== 'Apartment' && (
              <div className="form-group">
                <label className="form-label">Bed <span className="required">*</span></label>
                <CustomSelect options={bedOptions} value={formData.bed} onChange={(val) => handleSelectChange('bed', val)} placeholder={bedOptions.length ? "Select bed" : "Select room first"} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Rent Details */}
      <div className="form-section-card theme-green">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-green"><IndianRupee size={20} /></div>
            <div className="step-badge">6</div>
            <h2 className="form-section-title">Rent Details</h2>
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Monthly Rent <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><IndianRupee size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter amount" value={formData.monthlyRent} onChange={(e) => handleTextChange('monthlyRent', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Security Deposit <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><IndianRupee size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter amount" value={formData.securityDeposit} onChange={(e) => handleTextChange('securityDeposit', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Maintenance Charge <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><IndianRupee size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter amount" value={formData.maintenanceCharge} onChange={(e) => handleTextChange('maintenanceCharge', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="form-grid-2" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Rent Due Date <span className="required">*</span> <span className="text-slate-400 font-normal">( 1-31 )</span></label>
            <CustomSelect options={dueDaysOptions} value={formData.rentDueDate} onChange={(val) => handleSelectChange('rentDueDate', val)} placeholder="Select day (1-31)" />
          </div>
          <div className="form-group">
            <label className="form-label">Notice Period <span className="required">*</span> <span className="text-slate-400 font-normal">( Days )</span></label>
            <CustomSelect options={noticePeriodOptions} value={formData.noticePeriod} onChange={(val) => handleSelectChange('noticePeriod', val)} placeholder="Select days" />
          </div>
        </div>
      </div>

      {/* 7. Member Status */}
      <div className="form-section-card theme-orange">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-orange"><ShieldCheck size={20} /></div>
            <div className="step-badge">7</div>
            <h2 className="form-section-title">Member Status</h2>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Status <span className="required">*</span></label>
            <CustomSelect options={statusOptions} value={formData.status} onChange={(val) => handleSelectChange('status', val)} placeholder="Select status" />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><FileText size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Enter reason (required if status is Notice Period)" value={formData.reason} onChange={(e) => handleTextChange('reason', e.target.value)} />
            </div>
            <div className="text-right text-xs text-slate-400 mt-1">{formData.reason.length} / 500</div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 16px', margin: '16px 0', borderRadius: '6px', fontSize: '14px', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="form-actions" style={{ padding: '24px 0', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
        <Button variant="outline" icon={<X size={16} />} onClick={() => navigate('/member-management')} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" icon={<Save size={16} />} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Member'}
        </Button>
      </div>

        </div>
      </main>
    </div>
  );
};

export default MemberRegistration;
