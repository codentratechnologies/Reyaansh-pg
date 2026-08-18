import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, User, Phone, Mail, Calendar, 
  MapPin, BedDouble, IndianRupee, ShieldCheck, FileText, ChevronRight,
  Search, RotateCcw, ChevronLeft, ArrowUpDown, Image as ImageIcon
} from 'lucide-react';
import Button from '../../components/common/Button';
import '../../assets/dashboard.css';

const ViewMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('details');

  // Mock Data
  const member = {
    id: 'M01',
    name: 'Rahul Patel',
    mobile: '9876543210',
    altMobile: '9123456780',
    email: 'rahul@email.com',
    dob: '15-Aug-2000',
    gender: 'Male',
    occupation: 'Student',
    company: 'ABC University',
    joinedDate: '10-Jan-2024',
    status: 'Active',
    
    contactPerson: 'Ajay Patel',
    relationship: 'Father',
    
    addressLine1: '123 MG Road',
    addressLine2: 'Apt 4B',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India',
    
    pgType: 'PG',
    pgName: 'Sunshine PG',
    room: '101',
    bed: 'A',
    
    rent: '6,000.00',
    deposit: '10,000.00',
    maintenance: '500.00',
    dueDate: '05-Aug-2024',
    noticePeriod: '30 Days'
  };

  const paymentHistoryData = [
    { id: 1, month: 'Aug-26', amount: '6,000.00', dueDate: '05-Aug-26', paymentDate: '-', status: 'In Review', txId: 'TXN987654321', remarks: '-' },
    { id: 2, month: 'Jul-26', amount: '6,000.00', dueDate: '05-Jul-26', paymentDate: '04-Jul-26', status: 'Paid', txId: 'TXN123456789', remarks: 'On time' },
    { id: 3, month: 'Jun-26', amount: '6,000.00', dueDate: '05-Jun-26', paymentDate: '06-Jun-26', status: 'Paid', txId: 'TXN445566778', remarks: 'Late' },
    { id: 4, month: 'May-26', amount: '6,000.00', dueDate: '05-May-26', paymentDate: '03-May-26', status: 'Paid', txId: 'TXN778899001', remarks: 'On time' },
    { id: 5, month: 'Apr-26', amount: '6,000.00', dueDate: '05-Apr-26', paymentDate: '-', status: 'Pending', txId: '-', remarks: '-' },
    { id: 6, month: 'Mar-26', amount: '6,000.00', dueDate: '05-Mar-26', paymentDate: '07-Mar-26', status: 'Paid', txId: 'TXN556677889', remarks: 'Late' },
    { id: 7, month: 'Feb-26', amount: '6,000.00', dueDate: '05-Feb-26', paymentDate: '04-Feb-26', status: 'Paid', txId: 'TXN334455667', remarks: 'On time' },
    { id: 8, month: 'Jan-26', amount: '6,000.00', dueDate: '05-Jan-26', paymentDate: '03-Jan-26', status: 'Paid', txId: 'TXN112233445', remarks: 'On time' },
    { id: 9, month: 'Dec-25', amount: '6,000.00', dueDate: '05-Dec-25', paymentDate: '06-Dec-25', status: 'Paid', txId: 'TXN998877665', remarks: 'Late' },
    { id: 10, month: 'Nov-25', amount: '6,000.00', dueDate: '05-Nov-25', paymentDate: '04-Nov-25', status: 'Paid', txId: 'TXN667788990', remarks: 'On time' }
  ];

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="crumb-link">Dashboard</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-link" onClick={() => navigate('/member-management')} style={{cursor: 'pointer'}}>Member Management</span>
        <span className="crumb-separator"><ChevronRight size={14} /></span>
        <span className="crumb-current">View Member</span>
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center', marginBottom: '24px', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" icon={<ArrowLeft size={16} />} className="add-pg-btn" onClick={() => navigate('/member-management')} title="Back">
            <span className="hide-on-mobile">Back</span>
          </Button>
          <Button variant="primary" icon={<Edit2 size={16} />} className="add-pg-btn" title="Edit Member" onClick={() => navigate('/member-management/edit/' + member.id)}>
            <span className="hide-on-mobile">Edit Member</span>
          </Button>
        </div>
      </div>

      {/* Top Profile Card */}
      <div className="member-profile-card">
        <div className="member-avatar-large">
          <User size={40} />
        </div>
        <div className="member-profile-info">
          <h2>
            {member.name}
            <span className={`badge-status-${member.status.toLowerCase()}`}>{member.status}</span>
          </h2>
          <p>Member ID: {member.id}</p>
          <div className="member-meta-row">
            <div className="member-meta-item"><Phone size={16} /> {member.mobile}</div>
            <div className="member-meta-item"><Mail size={16} /> {member.email}</div>
            <div className="member-meta-item"><Calendar size={16} /> Joined on {member.joinedDate}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="member-tabs">
        <div className={`member-tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
          <FileText size={16} /> Details
        </div>
        <div className={`member-tab ${activeTab === 'payment' ? 'active' : ''}`} onClick={() => setActiveTab('payment')}>
          <IndianRupee size={16} /> Payment History
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <>
          {/* Top Grid (Masonry effect) */}
          <div className="view-grid-top">
            
            {/* Left Col: Personal Info */}
            <div className="view-card">
              <div className="view-card-header">
                <div className="view-card-icon bg-blue"><User size={18} /></div>
                <h3 className="view-card-title">Personal Information</h3>
              </div>
              <div className="info-grid info-grid-2">
                <div className="info-item">
                  <span className="info-label">Member ID</span>
                  <span className="info-value">{member.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{member.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mobile Number</span>
                  <span className="info-value">{member.mobile}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Alternate Mobile Number</span>
                  <span className="info-value">{member.altMobile}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{member.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Occupation</span>
                  <span className="info-value">{member.occupation}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">{member.dob}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{member.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Company / College Name</span>
                  <span className="info-value">{member.company}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Stacked Cards */}
            <div className="view-grid-top-right">
              
              {/* Emergency Contact */}
              <div className="view-card">
                <div className="view-card-header">
                  <div className="view-card-icon bg-blue"><Phone size={18} /></div>
                  <h3 className="view-card-title">Emergency Contact</h3>
                </div>
                <div className="info-grid info-grid-2">
                  <div className="info-item">
                    <span className="info-label">Contact Person Name</span>
                    <span className="info-value">{member.contactPerson}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Relationship</span>
                    <span className="info-value">{member.relationship}</span>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="view-card">
                <div className="view-card-header">
                  <div className="view-card-icon bg-blue"><MapPin size={18} /></div>
                  <h3 className="view-card-title">Address Details</h3>
                </div>
                <div className="info-grid info-grid-3">
                  <div className="info-item">
                    <span className="info-label">Address Line 1</span>
                    <span className="info-value">{member.addressLine1}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address Line 2</span>
                    <span className="info-value">{member.addressLine2}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City</span>
                    <span className="info-value">{member.city}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">State</span>
                    <span className="info-value">{member.state}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Pincode</span>
                    <span className="info-value">{member.pincode}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Country</span>
                    <span className="info-value">{member.country}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="view-grid-bottom">
            
            {/* Stay Details */}
            <div className="view-card">
              <div className="view-card-header">
                <div className="view-card-icon bg-blue"><BedDouble size={18} /></div>
                <h3 className="view-card-title">Stay Details</h3>
              </div>
              <div className="info-grid info-grid-2">
                <div className="info-item">
                  <span className="info-label">PG Type</span>
                  <span className="info-value">{member.pgType}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">PG Name</span>
                  <span className="info-value">{member.pgName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{member.pgType === 'Apartment' ? 'Flat No.' : 'Room No.'}</span>
                  <span className="info-value">{member.room}</span>
                </div>
                {member.pgType !== 'Apartment' && (
                  <div className="info-item">
                    <span className="info-label">Bed</span>
                    <span className="info-value">{member.bed}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rent Details */}
            <div className="view-card">
              <div className="view-card-header">
                <div className="view-card-icon bg-blue"><IndianRupee size={18} /></div>
                <h3 className="view-card-title">Rent Details</h3>
              </div>
              <div className="info-grid info-grid-2">
                <div className="info-item">
                  <span className="info-label">Monthly Rent</span>
                  <span className="info-value">₹ {member.rent}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Security Deposit</span>
                  <span className="info-value">₹ {member.deposit}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Maintenance Charge</span>
                  <span className="info-value">₹ {member.maintenance}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rent Due Date</span>
                  <span className="info-value">{member.dueDate}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Notice Period</span>
                  <span className="info-value">{member.noticePeriod}</span>
                </div>
              </div>
            </div>

            {/* Member Status */}
            <div className="view-card">
              <div className="view-card-header">
                <div className="view-card-icon bg-blue"><ShieldCheck size={18} /></div>
                <h3 className="view-card-title">Member Status</h3>
              </div>
              <div className="info-grid info-grid-2">
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className="info-value">
                    <span className={`badge-status-${member.status.toLowerCase()}`}>{member.status}</span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Reason</span>
                  <span className="info-value">-</span>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {activeTab === 'payment' && (
        <div className="payment-history-container">
          <div className="payment-history-toolbar">
            <div className="input-with-icon" style={{ width: '100%', maxWidth: '320px' }}>
              <div className="input-icon-left"><Search size={16} /></div>
              <input type="text" className="form-input pl-10" placeholder="Search by Month or Transaction ID..." />
            </div>
            <button className="action-icon-btn" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
              <RotateCcw size={16} color="#64748b" />
            </button>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Rent Amount <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Due Date <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Payment Date <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Payment Status <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Transaction ID <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Payment Screenshot <ArrowUpDown size={14} className="ml-1 inline" /></th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistoryData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.month}</td>
                    <td>₹ {row.amount}</td>
                    <td>{row.dueDate}</td>
                    <td>{row.paymentDate}</td>
                    <td>
                      <span className={`badge-status-${row.status.toLowerCase().replace(' ', '')}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.txId}</td>
                    <td>
                      {row.status !== 'Pending' ? (
                        <span className="text-link-blue">
                          <ImageIcon size={14} /> View Image
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-footer">
            <div className="pagination-controls">
              <div className="page-numbers">
                <button className="page-btn nav"><ChevronLeft size={16} /></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn nav"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewMember;
