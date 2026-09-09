import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import {
  User, Phone, PhoneCall, Mail, Calendar, Building,
  CreditCard, ShieldAlert, Home, MapPin, 
  BedDouble, IndianRupee, ShieldCheck, FileText, ChevronRight,
  ArrowLeft, X, Save, Eye, UploadCloud, Info, UserCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import '../../assets/dashboard.css';
import api from '../../utils/api';

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pre-filled Mock Data based on screenshot
  const [formData, setFormData] = useState({
    memberId: '',
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
    paymentMode: '',
    status: '',
    reason: ''
  });

  const [memberData, setMemberData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [memRes, availRes] = await Promise.all([
          api.get('/api/members', { params: { member_id: id } }),
          api.get('/api/pg/availability')
        ]);
        
        const mData = memRes.data?.data;
        if (mData) {
          setMemberData(mData);
          setFormData({
            memberId: mData.member_id || id,
            fullName: mData.full_name || '',
            mobile: mData.mobile_number || '',
            altMobile: mData.alternate_mobile_number || '',
            email: mData.email || '',
            occupation: mData.occupation || '',
            dob: mData.dob || '',
            gender: mData.gender || '',
            company: mData.company_college_name || '',
            aadhaarNo: mData.aadhaar_number || '',
            panNo: mData.pan_number || '',
            dlNo: mData.driving_licence_number || '',
            contactPerson: mData.emergency_contact_name || '',
            relationship: mData.emergency_contact_relationship || '',
            contactNumber: mData.emergency_contact_number || '',
            addressLine1: mData.address_line_1 || '',
            addressLine2: mData.address_line_2 || '',
            country: mData.country || 'IN',
            state: mData.state || '',
            city: mData.city || '',
            pincode: mData.pincode || '',
            pgType: mData.pg_type || '',
            pgName: mData.pg_id || '',
            roomNumber: mData.room_id || '',
            bed: mData.bed_id || '',
            monthlyRent: mData.monthly_rent ? String(mData.monthly_rent) : '',
            securityDeposit: mData.security_deposit ? String(mData.security_deposit) : '',
            maintenanceCharge: mData.maintenance_charge ? String(mData.maintenance_charge) : '',
            rentDueDate: mData.rent_due_date || '',
            noticePeriod: mData.notice_period_days ? String(mData.notice_period_days) : '',
            paymentMode: mData.paymentMode || '',
            status: mData.status || '',
            reason: mData.status_reason || ''
          });
        }

        const aData = availRes.data?.data || availRes.data || [];
        setAvailabilityData(Array.isArray(aData) ? aData : []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load member data");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  React.useEffect(() => {
    if (memberData && availabilityData.length > 0) {
      const selectedPg = availabilityData.find(pg => pg.pg_id === memberData.pg_id || pg.id === memberData.pg_id);
      if (selectedPg) {
        const rooms = selectedPg.available_rooms || [];
        setAvailableRooms(rooms);
        const selectedRoom = rooms.find(r => r.room_id === memberData.room_id || r.room_number === memberData.room_id);
        if (selectedRoom) {
          setAvailableBeds(selectedRoom.available_beds || []);
        }
      }
    }
  }, [memberData, availabilityData]);

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'pgName') {
        updated.roomNumber = '';
        updated.bed = '';
        const selectedPg = availabilityData.find(pg => (pg.pg_id === value || pg.id === value));
        setAvailableRooms(selectedPg?.available_rooms || []);
        setAvailableBeds([]);
      } else if (field === 'roomNumber') {
        updated.bed = '';
        const selectedRoom = availableRooms.find(r => (r.room_id === value || r.id === value || r.room_number === value));
        setAvailableBeds(selectedRoom?.available_beds || []);

        const rRent = selectedRoom?.rent || selectedRoom?.monthly_rent || selectedRoom?.rent_amount || selectedRoom?.price || selectedRoom?.room_rent;
        if (rRent) {
          updated.monthlyRent = String(rRent);
        }
      } else if (field === 'bed') {
        const selectedBed = availableBeds.find(b => (b.bed_id === value || b.id === value || b.bed_number === value));
        const bRent = selectedBed?.rent || selectedBed?.monthly_rent || selectedBed?.rent_amount || selectedBed?.price || selectedBed?.bed_rent;

        if (bRent) {
          updated.monthlyRent = String(bRent);
        } else {
          const selectedRoom = availableRooms.find(r => (r.room_id === updated.roomNumber || r.id === updated.roomNumber || r.room_number === updated.roomNumber));
          const rRent = selectedRoom?.rent || selectedRoom?.monthly_rent || selectedRoom?.rent_amount || selectedRoom?.price || selectedRoom?.room_rent;
          if (rRent) {
            updated.monthlyRent = String(rRent);
          }
        }
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        member_id: id,
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

      await api.put('/api/members', payload);
      navigate('/member-management');
    } catch (err) {
      console.error("Failed to update member:", err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || "Unknown error";
      setError(`Failed to update member. Error: ${errorMessage}`);
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
    value: String(i + 1).padStart(2, '0'), label: String(i + 1).padStart(2, '0')
  }));
  
  const noticePeriodOptions = [
    { value: '15', label: '15 Days' },
    { value: '30', label: '30 Days' },
    { value: '45', label: '45 Days' },
    { value: '60', label: '60 Days' }
  ];

  const paymentModeOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Bank Transfer', label: 'Bank Transfer' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Notice Period', label: 'Notice Period' },
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

  const roomOptions = availableRooms.map(r => {
    const rentVal = r.rent || r.monthly_rent || r.rent_amount || r.price || r.room_rent;
    const sharingInfo = r.sharing ? `${r.sharing} Sharing` : (r.bhk ? `${r.bhk} BHK` : '');
    const rentInfo = rentVal ? `₹${Number(rentVal).toLocaleString('en-IN')}` : '';
    
    let extraLabel = '';
    if (sharingInfo && rentInfo) extraLabel = ` (${sharingInfo} - ${rentInfo})`;
    else if (sharingInfo) extraLabel = ` (${sharingInfo})`;
    else if (rentInfo) extraLabel = ` (${rentInfo})`;

    return { 
      value: r.room_id || r.id || r.room_number, 
      label: `${r.room_number || r.flat_no || r.room_name}${extraLabel}` 
    };
  });

  const bedOptions = availableBeds.map(b => {
    const rentVal = b.rent || b.monthly_rent || b.rent_amount || b.price || b.bed_rent;
    const rentInfo = rentVal ? ` - ₹${Number(rentVal).toLocaleString('en-IN')}` : '';
    return { 
      value: b.bed_id || b.id || b.bed_number, 
      label: `${b.bed_name || b.bed_number}${rentInfo}` 
    };
  });

  if (isLoading) {
    return (
      <div className="page-container" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        Loading member data...
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-link" onClick={() => navigate('/member-management')} style={{cursor: 'pointer'}}>Member Management</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-link" onClick={() => navigate('/member-management')} style={{cursor: 'pointer'}}>Member List</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-current">Edit Member</span>
      </div>

      <div className="page-header" style={{ alignItems: 'flex-start', marginBottom: '32px', justifyContent: 'flex-end' }}>
        <Button variant="outline" icon={<ArrowLeft size={16} />} className="add-pg-btn" onClick={() => navigate('/member-management')} title="Back">
          <span className="hide-on-mobile">Back</span>
        </Button>
      </div>

      {/* 1. Personal Information */}
      <div className="form-section-card theme-blue">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-blue"><User size={20} /></div>
            <div className="step-badge">1</div>
            <div className="form-section-title-box">
              <h2 className="form-section-title">Personal Information</h2>
              <p className="form-section-subtitle">Basic details about the member.</p>
            </div>
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
              <input type="text" className="form-input" value={formData.fullName} onChange={(e) => handleTextChange('fullName', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" className="form-input pl-10" value={formData.mobile} onChange={(e) => handleTextChange('mobile', e.target.value)} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" className="form-input pl-10" value={formData.altMobile} onChange={(e) => handleTextChange('altMobile', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Mail size={16} /></div>
              <input type="email" className="form-input pl-10" value={formData.email} onChange={(e) => handleTextChange('email', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Occupation <span className="required">*</span></label>
            <CustomSelect options={occupationOptions} value={formData.occupation} onChange={(val) => handleSelectChange('occupation', val)} />
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth <span className="required">*</span></label>
            <CustomDatePicker 
              value={formData.dob} 
              onChange={(val) => handleTextChange('dob', val)} 
              placeholder="Select date of birth" 
              minYear={1940}
              maxYear={new Date().getFullYear()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender <span className="required">*</span></label>
            <CustomSelect options={genderOptions} value={formData.gender} onChange={(val) => handleSelectChange('gender', val)} />
          </div>
          <div className="form-group">
            <label className="form-label">Company / College Name <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Building size={16} /></div>
              <input type="text" className="form-input pl-10" value={formData.company} onChange={(e) => handleTextChange('company', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Identity Verification (Row-based layout) */}
      <div className="form-section-card theme-green">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-green"><ShieldCheck size={20} /></div>
            <div className="step-badge">2</div>
            <div className="form-section-title-box">
              <h2 className="form-section-title">Identity Verification</h2>
              <p className="form-section-subtitle">Provide identity documents and numbers.</p>
            </div>
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Aadhaar Card (Number) <span className="required">*</span></label>
            <input type="text" className="form-input" value={formData.aadhaarNo} onChange={(e) => handleTextChange('aadhaarNo', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">PAN <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" className="form-input" value={formData.panNo} onChange={(e) => handleTextChange('panNo', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Driving Licence <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" className="form-input" value={formData.dlNo} onChange={(e) => handleTextChange('dlNo', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Grid Row 1: Emergency & Address */}
      <div className="form-section-row">
        {/* 3. Emergency Contact */}
        <div className="form-section-card theme-orange">
          <div className="form-section-header">
            <div className="form-section-title-wrap">
              <div className="form-section-icon bg-orange"><ShieldAlert size={20} /></div>
              <div className="step-badge">3</div>
              <div className="form-section-title-box">
                <h2 className="form-section-title">Emergency Contact</h2>
                <p className="form-section-subtitle">Emergency contact details.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Contact Person Name <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.contactPerson} onChange={(e) => handleTextChange('contactPerson', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number <span className="required">*</span></label>
              <div className="input-with-icon">
                <div className="input-icon-left"><PhoneCall size={16} /></div>
                <input type="text" className="form-input pl-10" value={formData.contactNumber} onChange={(e) => handleTextChange('contactNumber', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Address Details */}
        <div className="form-section-card theme-purple">
          <div className="form-section-header">
            <div className="form-section-title-wrap">
              <div className="form-section-icon bg-purple"><MapPin size={20} /></div>
              <div className="step-badge">4</div>
              <div className="form-section-title-box">
                <h2 className="form-section-title">Address Details</h2>
                <p className="form-section-subtitle">Member's permanent address.</p>
              </div>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Address Line 1 <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.addressLine1} onChange={(e) => handleTextChange('addressLine1', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Address Line 2</label>
              <input type="text" className="form-input" value={formData.addressLine2} onChange={(e) => handleTextChange('addressLine2', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">City <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.city} onChange={(e) => handleTextChange('city', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">State <span className="required">*</span></label>
              <CustomSelect options={stateOptions} value={formData.state} onChange={(val) => handleSelectChange('state', val)} />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode <span className="required">*</span></label>
              <div className="input-with-icon">
                <div className="input-icon-left"><ShieldCheck size={16} /></div>
                <input type="text" className="form-input pl-10" value={formData.pincode} onChange={(e) => handleTextChange('pincode', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Country <span className="required">*</span></label>
              <CustomSelect options={countryOptions} value={formData.country} onChange={(val) => handleSelectChange('country', val)} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Stay & Rent Details */}
      <div className="form-section-row">
        {/* 5. Stay Details */}
        <div className="form-section-card theme-blue">
          <div className="form-section-header">
            <div className="form-section-title-wrap">
              <div className="form-section-icon bg-blue"><BedDouble size={20} /></div>
              <div className="step-badge">5</div>
              <div className="form-section-title-box">
                <h2 className="form-section-title">Stay Details</h2>
                <p className="form-section-subtitle">Select PG, Room and Bed.</p>
              </div>
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

          <div className="info-alert-blue">
            <Info size={16} style={{ marginTop: '2px' }} />
            <div>
              Room and Bed options update based on selection. Only vacant beds are shown.
            </div>
          </div>
        </div>
      </div>

        {/* 6. Rent Details */}
        <div className="form-section-card theme-green">
          <div className="form-section-header">
            <div className="form-section-title-wrap">
              <div className="form-section-icon bg-green"><IndianRupee size={20} /></div>
              <div className="step-badge">6</div>
              <div className="form-section-title-box">
                <h2 className="form-section-title">Rent Details</h2>
                <p className="form-section-subtitle">Financial terms and rent information.</p>
              </div>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Monthly Rent (₹) <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.monthlyRent} onChange={(e) => handleTextChange('monthlyRent', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit (₹) <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.securityDeposit} onChange={(e) => handleTextChange('securityDeposit', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Maintenance Charge (₹) <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.maintenanceCharge} onChange={(e) => handleTextChange('maintenanceCharge', e.target.value)} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Rent Due Date <span className="required">*</span> <span className="text-slate-400 font-normal">( 1-31 )</span></label>
              <CustomSelect options={dueDaysOptions} value={formData.rentDueDate} onChange={(val) => handleSelectChange('rentDueDate', val)} />
            </div>
            <div className="form-group">
              <label className="form-label">Notice Period <span className="required">*</span> <span className="text-slate-400 font-normal">( Days )</span></label>
              <CustomSelect options={noticePeriodOptions} value={formData.noticePeriod} onChange={(val) => handleSelectChange('noticePeriod', val)} />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode <span className="text-slate-400 font-normal">(Optional)</span></label>
              <CustomSelect options={paymentModeOptions} value={formData.paymentMode} onChange={(val) => handleSelectChange('paymentMode', val)} />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Member Status */}
      <div className="form-section-card theme-orange">
        <div className="form-section-header">
          <div className="form-section-title-wrap">
            <div className="form-section-icon bg-orange"><ShieldCheck size={20} /></div>
            <div className="step-badge">7</div>
            <div className="form-section-title-box">
              <h2 className="form-section-title">Member Status</h2>
              <p className="form-section-subtitle">Set current status of the member.</p>
            </div>
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Status <span className="required">*</span></label>
            <CustomSelect options={statusOptions} value={formData.status} onChange={(val) => handleSelectChange('status', val)} />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <input type="text" className="form-input" placeholder="Enter reason (required if status is Notice Period)" value={formData.reason} onChange={(e) => handleTextChange('reason', e.target.value)} />
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
          {isSubmitting ? 'Updating...' : 'Update Member'}
        </Button>
      </div>
    </div>
  );
};

export default EditMember;
