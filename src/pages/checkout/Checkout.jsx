import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, User, Building2, Smartphone, IndianRupee, Calendar, 
  Lock, AlertTriangle, Image as ImageIcon, Info, CloudUpload, Check,
  Home, FileText
} from 'lucide-react';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [file, setFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Inject PWA Manifest for isolated Checkout app
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/checkout-manifest.json';
    link.id = 'checkout-manifest';
    document.head.appendChild(link);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/checkout-sw.js').then((registration) => {
        console.log('Checkout PWA SW registered:', registration);
      }).catch((error) => {
        console.error('Checkout PWA SW registration failed:', error);
      });
    }

    return () => {
      // Cleanup manifest link when unmounting
      const existingLink = document.getElementById('checkout-manifest');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedMethod && file) {
      setShowSuccessModal(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', background: '#f8fafc' }}>
      <div className="checkout-page-wrapper">
        <div className="checkout-container">
          
          {/* Header */}
          <div className="checkout-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <IndianRupee size={16} strokeWidth={2.5} style={{ position: 'absolute', marginTop: '4px' }} />
              </div>
              <h1 className="checkout-title" style={{ margin: 0 }}>Monthly Rent Payment</h1>
            </div>
            <p className="checkout-subtitle">Secure payment link for your rent. Complete your payment below.</p>
            <div className="secure-alert pill" style={{ border: '1px solid #bfdbfe' }}>
              <ShieldCheck size={16} />
              <span>This is a secure payment link. Do not share it with anyone.</span>
            </div>
          </div>

          <div className="checkout-body">
            
            {/* Rent Details */}
            <div className="section-box">
              <div className="section-title-wrap">
                <FileText size={18} color="#1d4ed8" />
                <h3 className="section-title">Rent Details</h3>
              </div>
              <div className="rent-details-grid-custom">
                <div className="rent-col">
                  <div className="detail-row">
                    <User size={16} className="detail-icon" />
                    <span className="detail-label">Member Name</span>
                    <span className="detail-value">: Rahul Patel</span>
                  </div>
                  <div className="detail-row">
                    <Building2 size={16} className="detail-icon" />
                    <span className="detail-label">PG Name</span>
                    <span className="detail-value">: Sunshine PG</span>
                  </div>
                  <div className="detail-row">
                    <Smartphone size={16} className="detail-icon" />
                    <span className="detail-label">Room Number</span>
                    <span className="detail-value">: 102</span>
                  </div>
                </div>
                <div className="rent-divider"></div>
                <div className="rent-col">
                  <div className="detail-row">
                    <IndianRupee size={16} className="detail-icon" />
                    <span className="detail-label">Monthly Rent</span>
                    <span className="detail-value">: ₹6,000</span>
                  </div>
                  <div className="detail-row">
                    <Calendar size={16} className="detail-icon" />
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">: 05-Aug-2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Select Payment Method */}
            <div className="section-box">
              <h3 className="section-title" style={{ marginBottom: '4px' }}>Select Payment Method</h3>
              <p className="method-subtitle">Choose your preferred UPI app to proceed with payment.</p>
              
              <div className="payment-methods-grid">
                
                <div className={`method-card ${selectedMethod === 'gpay' ? 'active' : ''}`} onClick={() => setSelectedMethod('gpay')}>
                  <div className="method-radio">
                    <div className="method-radio-inner"></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img src="/Gpay.png" alt="Google Pay" style={{ height: '20px', objectFit: 'contain' }} />
                  </div>
                  <div className="method-info">
                    <span className="method-name">Google Pay</span>
                    <span className="method-sub">Pay using Google Pay</span>
                  </div>
                </div>

                <div className={`method-card ${selectedMethod === 'phonepe' ? 'active' : ''}`} onClick={() => setSelectedMethod('phonepe')}>
                  <div className="method-radio">
                    <div className="method-radio-inner"></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img src="/Phonepay.png" alt="PhonePe" style={{ height: '24px', objectFit: 'contain' }} />
                  </div>
                  <div className="method-info">
                    <span className="method-name">PhonePe</span>
                    <span className="method-sub">Pay using PhonePe</span>
                  </div>
                </div>

                <div className={`method-card ${selectedMethod === 'paytm' ? 'active' : ''}`} onClick={() => setSelectedMethod('paytm')}>
                  <div className="method-radio">
                    <div className="method-radio-inner"></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <img src="/paytm.png" alt="Paytm" style={{ height: '36px', objectFit: 'contain' }} />
                  </div>
                  <div className="method-info">
                    <span className="method-name">Paytm</span>
                    <span className="method-sub">Pay using Paytm</span>
                  </div>
                </div>

              </div>

              <div className="pay-button-wrap">
                <button className="pay-button">
                  <Lock size={18} />
                  Pay ₹6,000
                </button>
              </div>

              <div className="important-note">
                <div className="important-note-title">
                  <AlertTriangle size={16} />
                  Important Note
                </div>
                <ul>
                  <li>Please upload a payment screenshot in which the Transaction ID is clearly visible.</li>
                  <li>Screenshots without a visible Transaction ID may be rejected during verification.</li>
                </ul>
              </div>
            </div>

            {/* Upload Screenshot */}
            <div className="section-box">
              <h3 className="section-title" style={{ marginBottom: '4px' }}>Upload Payment Screenshot</h3>
              <p className="method-subtitle">Upload a clear screenshot of your payment as proof.</p>
              
              <label className="file-upload-zone" style={{ cursor: 'pointer' }}>
                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/png, image/jpeg" />
                <div className="file-choose-btn">
                  <FileText size={14} />
                  Choose File
                </div>
                <span className="file-name-text">{file ? file.name : 'No file chosen'}</span>
              </label>
              <div className="file-hint">Accepted formats: JPG, JPEG, PNG • Max size: 5MB</div>

              <div className="secure-alert" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155', marginBottom: '24px' }}>
                <Info size={16} color="#1d4ed8" />
                <span style={{ color: '#1d4ed8' }}>Make sure Transaction ID is clearly visible in the screenshot.</span>
              </div>

              <button 
                className={`submit-payment-btn ${selectedMethod && file ? 'active' : ''}`}
                onClick={handleSubmit}
                disabled={!selectedMethod || !file}
              >
                <CloudUpload size={18} />
                Submit Payment
              </button>

            </div>

            <div className="secure-footer">
              <Lock size={12} />
              Your payment details are secure and encrypted.
            </div>

          </div>
        </div>
      </div>
      
      {/* Spacer for bottom grey area from design */}
      <div className="checkout-page-footer"></div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal-content">
            <div className="success-icon-wrap">
              <Check size={28} strokeWidth={3} />
            </div>
            <h2 className="success-title">Payment Submitted Successfully</h2>
            <p className="success-subtitle">Thank you for your payment.</p>
            
            <div className="success-divider"></div>
            
            <p className="success-text">Your payment has been submitted successfully.</p>
            <p className="success-text">Payment Status : <span className="status-highlight">In Review</span></p>
            <p className="success-text">Our team will verify your payment within 48 hours.</p>
            <p className="success-text">You will receive confirmation once verification is completed.</p>
            
            <button className="close-btn" onClick={() => {
              setShowSuccessModal(false);
              navigate('/');
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
