import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, State, City } from 'country-state-city';
import {
  UserPlus, User, Phone, PhoneCall, Mail, Briefcase, Calendar, Building,
  CreditCard, CloudUpload, ShieldAlert, Home, MapPin, Map, Hash,
  BedDouble, Bed, Key, IndianRupee, Clock, ShieldCheck, FileText, ChevronRight,
  ArrowLeft, X, Save, Check, Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import CustomDatePicker from '../../components/common/CustomDatePicker';
import '../../assets/dashboard.css';

import api from '../../utils/api';
import { generateToken } from '../../utils/firebase';

const MemberRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    // Request Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission status:', permission);
      });
    }

    // Extract Device Model
    const getDeviceModel = () => {
      let model = 'Unknown Device';
      
      if (navigator.userAgentData) {
        navigator.userAgentData.getHighEntropyValues(['model'])
          .then(ua => {
            if (ua.model) {
              setFormData(prev => ({ ...prev, deviceModel: ua.model }));
            } else {
              setFormData(prev => ({ ...prev, deviceModel: parseUserAgent(navigator.userAgent) }));
            }
          })
          .catch(() => {
            setFormData(prev => ({ ...prev, deviceModel: parseUserAgent(navigator.userAgent) }));
          });
      } else {
        setFormData(prev => ({ ...prev, deviceModel: parseUserAgent(navigator.userAgent) }));
      }
    };

    const parseUserAgent = (ua) => {
      if (/android/i.test(ua)) {
        const match = ua.match(/Android.*?; (.*?)\sBuild/i);
        return (match && match[1]) ? match[1] : 'Android Device';
      } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        if (/iPhone/.test(ua)) return 'iPhone';
        if (/iPad/.test(ua)) return 'iPad';
        return 'iOS Device';
      }
      return 'Desktop/Other';
    };
    
    getDeviceModel();
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
    reason: '',
    deviceModel: ''
  });

  const [errors, setErrors] = useState({});

  const handleTextChange = (field, value) => {
    let sanitizedValue = value;

    // Strict numerical input filtering & length constraints
    if (field === 'mobile' || field === 'altMobile' || field === 'contactNumber') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'aadhaarNo') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (field === 'pincode') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
    } else if (field === 'monthlyRent' || field === 'securityDeposit' || field === 'maintenanceCharge') {
      sanitizedValue = value.replace(/\D/g, '').slice(0, 7);
    } else if (field === 'panNo') {
      sanitizedValue = value.toUpperCase().slice(0, 10);
    } else if (field === 'dob') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      if (digits.length >= 5) {
        sanitizedValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
      } else if (digits.length >= 3) {
        sanitizedValue = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        sanitizedValue = digits;
      }
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));

    // Clear field error on input
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectChange = (field, value) => {
    let autoRent = null;

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
        const selectedRoom = availableRooms.find(r => (r.room_id === value || r.id === value || r.room_number === value));
        setAvailableBeds(selectedRoom?.available_beds || []);

        const rRent = selectedRoom?.rent || selectedRoom?.monthly_rent || selectedRoom?.rent_amount || selectedRoom?.price || selectedRoom?.room_rent;
        if (rRent) {
          updated.monthlyRent = String(rRent);
          autoRent = String(rRent);
        }
      } else if (field === 'bed') {
        const selectedBed = availableBeds.find(b => (b.bed_id === value || b.id === value || b.bed_number === value));
        const bRent = selectedBed?.rent || selectedBed?.monthly_rent || selectedBed?.rent_amount || selectedBed?.price || selectedBed?.bed_rent;

        if (bRent) {
          updated.monthlyRent = String(bRent);
          autoRent = String(bRent);
        } else {
          const selectedRoom = availableRooms.find(r => (r.room_id === updated.roomNumber || r.id === updated.roomNumber || r.room_number === updated.roomNumber));
          const rRent = selectedRoom?.rent || selectedRoom?.monthly_rent || selectedRoom?.rent_amount || selectedRoom?.price || selectedRoom?.room_rent;
          if (rRent) {
            updated.monthlyRent = String(rRent);
            autoRent = String(rRent);
          }
        }
      }
      
      return updated;
    });

    if (errors[field] || autoRent) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        if (autoRent) delete next.monthlyRent;
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Personal Information
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = 'Mobile Number must be exactly 10 digits';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
    }

    if (formData.altMobile && formData.altMobile.length !== 10) {
      newErrors.altMobile = 'Alternate Mobile Number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.occupation) {
      newErrors.occupation = 'Please select an occupation';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company / College Name is required';
    }

    // 2. Identity Verification
    if (!formData.aadhaarNo) {
      newErrors.aadhaarNo = 'Aadhaar Number is required';
    } else if (formData.aadhaarNo.length !== 12) {
      newErrors.aadhaarNo = 'Aadhaar Number must be exactly 12 digits';
    }

    if (formData.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) {
      newErrors.panNo = 'Enter a valid 10-character PAN (e.g. ABCDE1234F)';
    }

    // 3. Emergency Contact
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact Person Name is required';
    }
    if (!formData.relationship) {
      newErrors.relationship = 'Please select a relationship';
    }
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Emergency Contact Number is required';
    } else if (formData.contactNumber.length !== 10) {
      newErrors.contactNumber = 'Emergency Contact Number must be 10 digits';
    }

    // 4. Address Details
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required';
    }
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    // 5. Stay Details
    if (!formData.pgType) {
      newErrors.pgType = 'Please select PG Type';
    }
    if (!formData.pgName) {
      newErrors.pgName = 'Please select a PG Property';
    }
    if (!formData.roomNumber) {
      newErrors.roomNumber = 'Please select a Room/Flat Number';
    }
    if (formData.pgType !== 'Apartment' && !formData.bed) {
      newErrors.bed = 'Please select a Bed';
    }

    // 6. Rent Details
    if (!formData.monthlyRent) {
      newErrors.monthlyRent = 'Monthly Rent is required';
    } else if (Number(formData.monthlyRent) <= 0) {
      newErrors.monthlyRent = 'Monthly Rent must be greater than 0';
    }

    if (!formData.securityDeposit) {
      newErrors.securityDeposit = 'Security Deposit is required';
    }
    if (!formData.maintenanceCharge) {
      newErrors.maintenanceCharge = 'Maintenance Charge is required';
    }
    if (!formData.rentDueDate) {
      newErrors.rentDueDate = 'Please select Rent Due Date';
    }
    if (!formData.noticePeriod) {
      newErrors.noticePeriod = 'Please select Notice Period';
    }

    // 7. Member Status
    if (!formData.status) {
      newErrors.status = 'Please select Member Status';
    }
    if (formData.status === 'Notice Period' && !formData.reason.trim()) {
      newErrors.reason = 'Reason is required when status is Notice Period';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError("Please fix the highlighted errors before submitting the form.");
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.form-input.error, .custom-select-trigger.error');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const fcmToken = await generateToken();
      console.log('Generated FCM Token:', fcmToken);

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
        status: formData.status,
        device_code: formData.deviceModel
      };

      if (formData.pgType === 'PG') payload.bed_id = formData.bed;
      if (formData.status === 'Notice Period') payload.status_reason = formData.reason;
      if (formData.altMobile) payload.alternate_mobile_number = formData.altMobile;
      if (formData.email) payload.email = formData.email;
      if (formData.panNo) payload.pan_number = formData.panNo;
      if (formData.dlNo) payload.driving_licence_number = formData.dlNo;
      if (formData.addressLine2) payload.address_line_2 = formData.addressLine2;
      if (fcmToken) payload.fcm_token = fcmToken;

      // Step 1: Save the member
      const memberRes = await api.post('/api/members', payload);
      const memberId = memberRes.data?.member_id || memberRes.data?.id || memberRes.data?.data?.member_id;

      // Step 2: Fire calendar invite (fire-and-forget — won't block navigation)
      if (memberId) {
        const checkoutUrl = `https://reyaansh-pg.vercel.app/checkout?member_id=${memberId}`;
        api.post('/api/send-calendar-reminder/', {
          member_id: memberId,
          title: 'Monthly Rent Due',
          description: 'Please remember to pay your rent! Your timely payment is appreciated.',
          checkout_url: checkoutUrl,
        }).catch((err) => {
          // Log but don't block — member was saved successfully
          console.warn('Calendar invite failed (non-blocking):', err?.response?.data || err.message);
        });
      }

      setIsSubmitted(true);
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

  if (isSubmitted) {
    const selectedPgObj = pgOptions.find(p => p.value === formData.pgName);
    const pgLabel = selectedPgObj ? selectedPgObj.label : (formData.pgName || 'Reyaansh PG');
    const selectedRoomObj = roomOptions.find(r => r.value === formData.roomNumber);
    const roomLabel = selectedRoomObj ? selectedRoomObj.label : (formData.roomNumber || '-');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto', backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '48px 32px', margin: '20px', maxWidth: '560px', width: '100%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          
          <div style={{ width: '72px', height: '72px', background: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
            <Check size={40} strokeWidth={3} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#065f46', margin: '0 0 8px' }}>
            Registration Successful! 🎉
          </h1>

          <p style={{ fontSize: '14.5px', color: '#475569', margin: '0 0 24px', lineHeight: '1.5' }}>
            Welcome to <strong>Reyaansh PG</strong>, <strong>{formData.fullName || 'Member'}</strong>! Your registration details have been submitted.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', margin: '0 auto 24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>Full Name:</span>
              <strong style={{ color: '#0f172a' }}>{formData.fullName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>Mobile:</span>
              <strong style={{ color: '#0f172a' }}>{formData.mobile}</strong>
            </div>
            {formData.email && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>Email:</span>
                <strong style={{ color: '#0f172a' }}>{formData.email}</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>PG Property:</span>
              <strong style={{ color: '#0f172a' }}>{pgLabel}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>Room / Flat No.:</span>
              <strong style={{ color: '#0f172a' }}>{roomLabel}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>Monthly Rent:</span>
              <strong style={{ color: '#1d4ed8' }}>₹{formData.monthlyRent ? Number(formData.monthlyRent).toLocaleString('en-IN') : '-'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13.5px' }}>
              <span style={{ color: '#64748b' }}>Rent Due Date:</span>
              <strong style={{ color: '#0f172a' }}>Day {formData.rentDueDate || '-'} of every month</strong>
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', color: '#1e40af', fontSize: '13px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
            <Info size={18} color="#1d4ed8" style={{ flexShrink: 0 }} />
            <span>A monthly rent reminder calendar invite has been sent to your device.</span>
          </div>

          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0' }}>
            You may safely close this browser tab now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      {/* Simple standalone header */}
      <header className="member-reg-header" style={{ backgroundColor: '#ffffff', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '600' }}>Reyaansh PG - Member Registration</h1>
      </header>

      <main className="member-reg-main" style={{ padding: '24px' }}>
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
              <input type="text" className={`form-input ${errors.fullName ? 'error' : ''}`} placeholder="Enter full name" value={formData.fullName} onChange={(e) => handleTextChange('fullName', e.target.value)} />
            </div>
            {errors.fullName && <span className="form-error-text">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number <span className="required">*</span></label>
            <div className="input-with-icon">
              <input type="text" maxLength={10} className={`form-input ${errors.mobile ? 'error' : ''}`} placeholder="Enter 10 digit number" value={formData.mobile} onChange={(e) => handleTextChange('mobile', e.target.value)} />
            </div>
            {errors.mobile && <span className="form-error-text">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Alternate Mobile Number</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" maxLength={10} className={`form-input pl-10 ${errors.altMobile ? 'error' : ''}`} placeholder="Enter alternate number" value={formData.altMobile} onChange={(e) => handleTextChange('altMobile', e.target.value)} />
            </div>
            {errors.altMobile && <span className="form-error-text">{errors.altMobile}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Mail size={16} /></div>
              <input type="email" className={`form-input pl-10 ${errors.email ? 'error' : ''}`} placeholder="Enter email address" value={formData.email} onChange={(e) => handleTextChange('email', e.target.value)} />
            </div>
            {errors.email && <span className="form-error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Occupation <span className="required">*</span></label>
            <CustomSelect options={occupationOptions} value={formData.occupation} onChange={(val) => handleSelectChange('occupation', val)} placeholder="Select occupation" error={!!errors.occupation} />
            {errors.occupation && <span className="form-error-text">{errors.occupation}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Date of Birth <span className="required">*</span></label>
            <CustomDatePicker 
              value={formData.dob} 
              onChange={(val) => handleTextChange('dob', val)} 
              placeholder="Select date of birth" 
              error={!!errors.dob}
              minYear={1940}
              maxYear={new Date().getFullYear()}
            />
            {errors.dob && <span className="form-error-text">{errors.dob}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Gender <span className="required">*</span></label>
            <CustomSelect options={genderOptions} value={formData.gender} onChange={(val) => handleSelectChange('gender', val)} placeholder="Select gender" error={!!errors.gender} />
            {errors.gender && <span className="form-error-text">{errors.gender}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Company / College Name <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><Building size={16} /></div>
              <input type="text" className={`form-input pl-10 ${errors.company ? 'error' : ''}`} placeholder="Enter company / college name" value={formData.company} onChange={(e) => handleTextChange('company', e.target.value)} />
            </div>
            {errors.company && <span className="form-error-text">{errors.company}</span>}
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
              <input type="text" maxLength={12} className={`form-input pl-10 ${errors.aadhaarNo ? 'error' : ''}`} placeholder="Enter 12 digit Aadhaar no." value={formData.aadhaarNo} onChange={(e) => handleTextChange('aadhaarNo', e.target.value)} />
            </div>
            {errors.aadhaarNo && <span className="form-error-text">{errors.aadhaarNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">PAN <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><CreditCard size={16} /></div>
              <input type="text" maxLength={10} className={`form-input pl-10 ${errors.panNo ? 'error' : ''}`} placeholder="Enter PAN number" value={formData.panNo} onChange={(e) => handleTextChange('panNo', e.target.value)} />
            </div>
            {errors.panNo && <span className="form-error-text">{errors.panNo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Driving Licence <span className="text-slate-400 font-normal">(Optional)</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><FileText size={16} /></div>
              <input type="text" className={`form-input pl-10 ${errors.dlNo ? 'error' : ''}`} placeholder="Enter DL number" value={formData.dlNo} onChange={(e) => handleTextChange('dlNo', e.target.value)} />
            </div>
            {errors.dlNo && <span className="form-error-text">{errors.dlNo}</span>}
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
              <input type="text" className={`form-input pl-10 ${errors.contactPerson ? 'error' : ''}`} placeholder="Enter contact person name" value={formData.contactPerson} onChange={(e) => handleTextChange('contactPerson', e.target.value)} />
            </div>
            {errors.contactPerson && <span className="form-error-text">{errors.contactPerson}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Relationship <span className="required">*</span></label>
            <CustomSelect options={relationshipOptions} value={formData.relationship} onChange={(val) => handleSelectChange('relationship', val)} placeholder="Select relationship" error={!!errors.relationship} />
            {errors.relationship && <span className="form-error-text">{errors.relationship}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><PhoneCall size={16} /></div>
              <input type="text" maxLength={10} className={`form-input pl-10 ${errors.contactNumber ? 'error' : ''}`} placeholder="Enter 10 digit number" value={formData.contactNumber} onChange={(e) => handleTextChange('contactNumber', e.target.value)} />
            </div>
            {errors.contactNumber && <span className="form-error-text">{errors.contactNumber}</span>}
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
              <input type="text" className={`form-input pl-10 ${errors.addressLine1 ? 'error' : ''}`} placeholder="Enter address line 1" value={formData.addressLine1} onChange={(e) => handleTextChange('addressLine1', e.target.value)} />
            </div>
            {errors.addressLine1 && <span className="form-error-text">{errors.addressLine1}</span>}
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
            <CustomSelect options={countryOptions} value={formData.country} onChange={(val) => handleSelectChange('country', val)} placeholder="Select country" error={!!errors.country} />
            {errors.country && <span className="form-error-text">{errors.country}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">State <span className="required">*</span></label>
            <CustomSelect options={stateOptions} value={formData.state} onChange={(val) => handleSelectChange('state', val)} placeholder="Select state" error={!!errors.state} />
            {errors.state && <span className="form-error-text">{errors.state}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">City <span className="required">*</span></label>
            <CustomSelect options={cityOptions} value={formData.city} onChange={(val) => handleSelectChange('city', val)} placeholder="Select city" error={!!errors.city} />
            {errors.city && <span className="form-error-text">{errors.city}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Pincode <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><MapPin size={16} /></div>
              <input type="text" maxLength={6} className={`form-input pl-10 ${errors.pincode ? 'error' : ''}`} placeholder="Enter 6 digit pincode" value={formData.pincode} onChange={(e) => handleTextChange('pincode', e.target.value)} />
            </div>
            {errors.pincode && <span className="form-error-text">{errors.pincode}</span>}
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
              <CustomSelect options={pgTypeOptions} value={formData.pgType} onChange={(val) => handleSelectChange('pgType', val)} placeholder="Select type" error={!!errors.pgType} />
              {errors.pgType && <span className="form-error-text">{errors.pgType}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">PG Name <span className="required">*</span></label>
              <CustomSelect options={pgOptions} value={formData.pgName} onChange={(val) => handleSelectChange('pgName', val)} placeholder={pgOptions.length ? "Select PG" : "Loading..."} error={!!errors.pgName} />
              {errors.pgName && <span className="form-error-text">{errors.pgName}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Room/Flat Number <span className="required">*</span></label>
              <CustomSelect options={roomOptions} value={formData.roomNumber} onChange={(val) => handleSelectChange('roomNumber', val)} placeholder={roomOptions.length ? "Select room" : "Select PG first"} error={!!errors.roomNumber} />
              {errors.roomNumber && <span className="form-error-text">{errors.roomNumber}</span>}
            </div>
            {formData.pgType !== 'Apartment' && (
              <div className="form-group">
                <label className="form-label">Bed <span className="required">*</span></label>
                <CustomSelect options={bedOptions} value={formData.bed} onChange={(val) => handleSelectChange('bed', val)} placeholder={bedOptions.length ? "Select bed" : "Select room first"} error={!!errors.bed} />
                {errors.bed && <span className="form-error-text">{errors.bed}</span>}
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
              <input type="text" maxLength={7} className={`form-input pl-10 ${errors.monthlyRent ? 'error' : ''}`} placeholder="Enter amount" value={formData.monthlyRent} onChange={(e) => handleTextChange('monthlyRent', e.target.value)} />
            </div>
            {errors.monthlyRent && <span className="form-error-text">{errors.monthlyRent}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Security Deposit <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><IndianRupee size={16} /></div>
              <input type="text" maxLength={7} className={`form-input pl-10 ${errors.securityDeposit ? 'error' : ''}`} placeholder="Enter amount" value={formData.securityDeposit} onChange={(e) => handleTextChange('securityDeposit', e.target.value)} />
            </div>
            {errors.securityDeposit && <span className="form-error-text">{errors.securityDeposit}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Maintenance Charge <span className="required">*</span></label>
            <div className="input-with-icon">
              <div className="input-icon-left"><IndianRupee size={16} /></div>
              <input type="text" maxLength={7} className={`form-input pl-10 ${errors.maintenanceCharge ? 'error' : ''}`} placeholder="Enter amount" value={formData.maintenanceCharge} onChange={(e) => handleTextChange('maintenanceCharge', e.target.value)} />
            </div>
            {errors.maintenanceCharge && <span className="form-error-text">{errors.maintenanceCharge}</span>}
          </div>
        </div>
        <div className="form-grid-2" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Rent Due Date <span className="required">*</span> <span className="text-slate-400 font-normal">( 1-31 )</span></label>
            <CustomSelect options={dueDaysOptions} value={formData.rentDueDate} onChange={(val) => handleSelectChange('rentDueDate', val)} placeholder="Select day (1-31)" error={!!errors.rentDueDate} />
            {errors.rentDueDate && <span className="form-error-text">{errors.rentDueDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Notice Period <span className="required">*</span> <span className="text-slate-400 font-normal">( Days )</span></label>
            <CustomSelect options={noticePeriodOptions} value={formData.noticePeriod} onChange={(val) => handleSelectChange('noticePeriod', val)} placeholder="Select days" error={!!errors.noticePeriod} />
            {errors.noticePeriod && <span className="form-error-text">{errors.noticePeriod}</span>}
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
            <CustomSelect options={statusOptions} value={formData.status} onChange={(val) => handleSelectChange('status', val)} placeholder="Select status" error={!!errors.status} />
            {errors.status && <span className="form-error-text">{errors.status}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <div className="input-with-icon">
              <div className="input-icon-left"><FileText size={16} /></div>
              <input type="text" className={`form-input pl-10 ${errors.reason ? 'error' : ''}`} placeholder="Enter reason (required if status is Notice Period)" value={formData.reason} onChange={(e) => handleTextChange('reason', e.target.value)} />
            </div>
            {errors.reason && <span className="form-error-text">{errors.reason}</span>}
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
