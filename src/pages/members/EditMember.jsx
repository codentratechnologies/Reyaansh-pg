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
import '../../assets/dashboard.css';

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pre-filled Mock Data based on screenshot
  const [formData, setFormData] = useState({
    memberId: 'M01',
    fullName: 'Rahul Patel',
    mobile: '9876543210',
    altMobile: '9123456780',
    email: 'rahul@email.com',
    occupation: 'Student',
    dob: '15/08/2000',
    gender: 'Male',
    company: 'ABC University',
    
    aadhaarNo: '123456789012',
    panNo: 'ABCDE1234F',
    dlNo: 'DL142011001',
    
    contactPerson: 'Ajay Patel',
    relationship: 'Father',
    contactNumber: '9123456780',
    
    addressLine1: 'Plot 42, Sector 1',
    addressLine2: 'Opposite Park',
    country: 'IN', // 'India'
    state: 'KA', // 'Karnataka'
    city: 'Bengaluru',
    pincode: '560034',
    
    pgType: 'PG',
    pgName: 'PG1', // 'Sunshine PG'
    roomNumber: '102',
    bed: 'A',
    
    monthlyRent: '6000',
    securityDeposit: '12000',
    maintenanceCharge: '500',
    rentDueDate: '05',
    noticePeriod: '30',
    paymentMode: 'Cash',
    
    status: 'Active',
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
            <div className="input-with-icon">
              <div className="input-icon-left"><Calendar size={16} /></div>
              <input type="text" className="form-input pl-10" value={formData.dob} onChange={(e) => handleTextChange('dob', e.target.value)} />
            </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="file-row">
            <div className="form-group">
              <label className="form-label">Aadhaar Card (Number) <span className="required">*</span></label>
              <input type="text" className="form-input" value={formData.aadhaarNo} onChange={(e) => handleTextChange('aadhaarNo', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Current File</label>
              <div className="current-file-box">
                <div className="current-file-info">
                  <FileText size={16} color="#dc2626" />
                  <span>aadhar.pdf</span>
                </div>
                <Eye size={16} className="icon-view" />
              </div>
            </div>
            <div className="form-group">
              <Button variant="outline" icon={<UploadCloud size={16} />} style={{ height: '40px' }}>Replace File</Button>
            </div>
          </div>

          <div className="file-row">
            <div className="form-group">
              <label className="form-label">PAN <span className="text-slate-400 font-normal">(Optional)</span></label>
              <input type="text" className="form-input" value={formData.panNo} onChange={(e) => handleTextChange('panNo', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Current File</label>
              <div className="current-file-box">
                <div className="current-file-info">
                  <FileText size={16} color="#dc2626" />
                  <span>pan.jpg</span>
                </div>
                <Eye size={16} className="icon-view" />
              </div>
            </div>
            <div className="form-group">
              <Button variant="outline" icon={<UploadCloud size={16} />} style={{ height: '40px' }}>Replace File</Button>
            </div>
          </div>

          <div className="file-row">
            <div className="form-group">
              <label className="form-label">Driving Licence <span className="text-slate-400 font-normal">(Optional)</span></label>
              <input type="text" className="form-input" value={formData.dlNo} onChange={(e) => handleTextChange('dlNo', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Current File</label>
              <div className="current-file-box">
                <div className="current-file-info">
                  <FileText size={16} color="#dc2626" />
                  <span>dl.png</span>
                </div>
                <Eye size={16} className="icon-view" />
              </div>
            </div>
            <div className="form-group">
              <Button variant="outline" icon={<UploadCloud size={16} />} style={{ height: '40px' }}>Replace File</Button>
            </div>
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

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">PG Type <span className="required">*</span></label>
              <CustomSelect options={pgTypeOptions} value={formData.pgType} onChange={(val) => handleSelectChange('pgType', val)} />
            </div>
            <div className="form-group">
              <label className="form-label">PG Name <span className="required">*</span></label>
              <CustomSelect options={[{value: 'PG1', label: 'Sunshine PG'}]} value={formData.pgName} onChange={(val) => handleSelectChange('pgName', val)} />
            </div>
          </div>
          <div className="form-grid-2" style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Room/Flat Number <span className="required">*</span></label>
              <CustomSelect options={[{value: '102', label: '102'}]} value={formData.roomNumber} onChange={(val) => handleSelectChange('roomNumber', val)} />
            </div>
            {formData.pgType !== 'Apartment' && (
              <div className="form-group">
                <label className="form-label">Bed <span className="required">*</span></label>
                <CustomSelect options={[{value: 'A', label: 'A'}]} value={formData.bed} onChange={(val) => handleSelectChange('bed', val)} />
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

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <Button variant="outline" icon={<X size={16} />} onClick={() => navigate('/member-management')}>Cancel</Button>
        <Button variant="primary" icon={<Save size={16} />} onClick={() => navigate('/member-management')}>Update Member</Button>
      </div>
    </div>
  );
};

export default EditMember;
