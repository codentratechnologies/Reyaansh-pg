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

const AddMember = () => {
  const navigate = useNavigate();

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
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-link" onClick={() => navigate('/member-management')} style={{ cursor: 'pointer' }}>Member Management</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-current">Add Member</span>
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'flex-start', justifyContent: 'flex-end' }}>
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

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">PG Type <span className="required">*</span></label>
            <CustomSelect options={pgTypeOptions} value={formData.pgType} onChange={(val) => handleSelectChange('pgType', val)} placeholder="Select type" />
          </div>
          <div className="form-group">
            <label className="form-label">PG Name <span className="required">*</span></label>
            <CustomSelect options={[{ value: 'PG1', label: 'Sunshine PG' }]} value={formData.pgName} onChange={(val) => handleSelectChange('pgName', val)} placeholder="Select PG" />
          </div>
        </div>
        <div className="form-grid-2" style={{ marginTop: '20px' }}>
          <div className="form-group">
            <label className="form-label">Room/Flat Number <span className="required">*</span></label>
            <CustomSelect options={[{ value: '101', label: '101' }]} value={formData.roomNumber} onChange={(val) => handleSelectChange('roomNumber', val)} placeholder="Select room" />
          </div>
          {formData.pgType !== 'Apartment' && (
            <div className="form-group">
              <label className="form-label">Bed <span className="required">*</span></label>
              <CustomSelect options={[{ value: 'A', label: 'A' }]} value={formData.bed} onChange={(val) => handleSelectChange('bed', val)} placeholder="Select bed" />
            </div>
          )}
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

      {/* Bottom Actions */}
      <div className="form-actions" style={{ padding: '24px 0', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px' }}>
        <Button variant="outline" icon={<X size={16} />} onClick={() => navigate('/member-management')}>
          Cancel
        </Button>
        <Button variant="primary" icon={<Save size={16} />} onClick={() => navigate('/member-management')}>
          Save Member
        </Button>
      </div>

    </div>
  );
};

export default AddMember;
