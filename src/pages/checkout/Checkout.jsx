import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, User, Building2, Smartphone, IndianRupee, Calendar, 
  Lock, AlertTriangle, Image as ImageIcon, Info, CloudUpload, Check,
  Home, FileText
} from 'lucide-react';
import api from '../../utils/api';
import Tesseract from 'tesseract.js';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [file, setFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState('');
  const [extractedUtr, setExtractedUtr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    memberName: '',
    pgName: '',
    roomNumber: '',
    monthlyRent: '',
    dueDate: '',
    paymentLinks: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('member_id');

    if (!memberId) return;

    const fetchCheckoutData = async () => {
      setIsLoading(true);
      
      let fetchedName = '';
      let fetchedRent = '';
      let fetchedPg = '';
      let fetchedRoom = '';
      let fetchedDue = '';
      let fetchedLinks = null;

      // 1. Try to fetch generate-payment-link
      try {
        const payRes = await api.get('/api/generate-payment-link/', {
          params: { member_id: memberId }
        });
        if (payRes.data) {
          const nameFromPay = payRes.data.member_name || payRes.data.full_name || payRes.data.name;
          if (nameFromPay && nameFromPay !== 'Unknown') {
            fetchedName = nameFromPay;
          }
          fetchedRent = payRes.data.rent_amount || payRes.data.monthly_rent || payRes.data.rent || '';
          fetchedLinks = payRes.data.payment_links || payRes.data.links || payRes.data;
        }
      } catch (err) {
        console.warn("Could not fetch payment link data:", err);
      }

      // 2. Try to fetch member details for full_name, PG Name, Room, Due Date
      try {
        const memRes = await api.get('/api/members', {
          params: { member_id: memberId }
        });
        const rawData = memRes.data?.data !== undefined ? memRes.data.data : memRes.data;
        const mData = Array.isArray(rawData) ? (rawData.find(m => String(m.id || m.member_id) === String(memberId)) || rawData[0] || {}) : (rawData || {});
        
        if (mData) {
          const nameFromMember = mData.full_name || mData.name || mData.member_name;
          if (nameFromMember && nameFromMember !== 'Unknown') {
            fetchedName = nameFromMember;
          }
          if (!fetchedRent) fetchedRent = mData.monthly_rent || mData.rent || mData.rent_amount || '';
          fetchedPg = mData.pg_name || mData.pg || '-';
          fetchedRoom = mData.room_number || mData.room_no || mData.room || '-';
          fetchedDue = mData.rent_due_date || mData.due_date ? `${mData.rent_due_date || mData.due_date}` : '-';
        }
      } catch (err) {
        console.warn("Could not fetch member details:", err);
      }

      setCheckoutData({
        memberName: fetchedName || '',
        pgName: fetchedPg || '-',
        roomNumber: fetchedRoom || '-',
        monthlyRent: fetchedRent ? Number(fetchedRent).toLocaleString('en-IN') : '-',
        dueDate: fetchedDue || '-',
        paymentLinks: fetchedLinks
      });
      setIsLoading(false);
    };

    fetchCheckoutData();
  }, []);

  const handlePayRedirect = (method) => {
    const activeMethod = method || selectedMethod;
    if (!activeMethod) {
      alert("Please select a payment method first.");
      return;
    }
    const links = checkoutData.paymentLinks;
    let targetUrl = null;
    if (links) {
      if (activeMethod === 'gpay') {
        targetUrl = links.google_pay || links.gpay || links.generic_upi;
      } else if (activeMethod === 'phonepe') {
        targetUrl = links.phonepe || links.generic_upi;
      } else if (activeMethod === 'paytm') {
        targetUrl = links.paytm || links.generic_upi;
      }
    }
    
    if (targetUrl) {
      window.location.href = targetUrl;
    } else {
      console.log(`Redirecting to default UPI for ${activeMethod}...`);
    }
  };

  const handleFileChange = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selectedFile = e.target.files[0];
    const fileInput = e.target;

    setIsScanning(true);
    setOcrProgress('Reading screenshot image...');
    setExtractedUtr(null);

    try {
      const result = await Tesseract.recognize(selectedFile, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(`Scanning image (${Math.round((m.progress || 0) * 100)}%)...`);
          }
        }
      });

      const text = result?.data?.text || '';
      console.log('OCR Scanned Text:', text);

      // Regex patterns for UTR / Transaction ID:
      // 1. Any 12-digit continuous numeric string (e.g. 423456789012)
      // 2. 12 digits separated by spaces or dashes (e.g. 4234 5678 9012)
      // 3. Keywords like UPI Ref / UTR / Txn ID followed by alphanumeric code
      const digitsMatch = text.match(/\b\d{12}\b/) || text.match(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/);
      const keywordMatch = text.match(/(?:UPI|Ref|UTR|Txn|Transaction|Reference)\s*[:#-]?\s*([A-Za-z0-9]{8,20})/i);

      let foundUtr = null;
      if (digitsMatch) {
        foundUtr = digitsMatch[0].replace(/\s|-/g, '');
      } else if (keywordMatch && keywordMatch[1]) {
        foundUtr = keywordMatch[1];
      }

      if (foundUtr) {
        setFile(selectedFile);
        setExtractedUtr(foundUtr);
      } else {
        // UTR is not visible in screenshot
        setFile(null);
        if (fileInput) fileInput.value = '';
        setShowInvalidModal(true);
      }
    } catch (err) {
      console.error("OCR scanning failed:", err);
      setFile(null);
      if (fileInput) fileInput.value = '';
      setShowInvalidModal(true);
    } finally {
      setIsScanning(false);
      setOcrProgress('');
    }
  };

  const handleSubmit = async () => {
    if (file && !isScanning) {
      setIsLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get('member_id');

        const formData = new FormData();
        if (memberId) formData.append('member_id', memberId);
        if (extractedUtr) formData.append('transaction_id', extractedUtr);
        if (selectedMethod) formData.append('payment_method', selectedMethod);
        formData.append('proof_image', file);

        await api.post('/api/submit-payment-proof/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setIsSubmitted(true);
      } catch (err) {
        console.error("Failed to submit payment proof:", err);
        alert("Failed to submit payment proof. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="checkout-page-root">
      <div className="checkout-page-wrapper">
        <div className="checkout-container">
          
          {/* Header */}
          <div className="checkout-header">
            <div className="checkout-header-badge">
              <div className="checkout-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <IndianRupee size={15} strokeWidth={2.5} style={{ position: 'absolute', marginTop: '4px' }} />
              </div>
              <h1 className="checkout-title">Monthly Rent Payment</h1>
            </div>
            <p className="checkout-subtitle">Secure payment link for your rent. Complete your payment below.</p>
            <div className="secure-alert pill">
              <ShieldCheck size={16} style={{ flexShrink: 0 }} />
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
              <div className="rent-details-card">
                <div className="detail-item">
                  <div className="detail-item-left">
                    <User size={16} className="detail-icon" />
                    <span className="detail-label">Member Name</span>
                  </div>
                  <span className="detail-value">{checkoutData.memberName || '-'}</span>
                </div>

                <div className="detail-item">
                  <div className="detail-item-left">
                    <Building2 size={16} className="detail-icon" />
                    <span className="detail-label">PG Name</span>
                  </div>
                  <span className="detail-value">{checkoutData.pgName || '-'}</span>
                </div>

                <div className="detail-item">
                  <div className="detail-item-left">
                    <Smartphone size={16} className="detail-icon" />
                    <span className="detail-label">Room Number</span>
                  </div>
                  <span className="detail-value">{checkoutData.roomNumber || '-'}</span>
                </div>

                <div className="detail-item">
                  <div className="detail-item-left">
                    <IndianRupee size={16} className="detail-icon" />
                    <span className="detail-label">Monthly Rent</span>
                  </div>
                  <span className="detail-value rent-highlight">₹{checkoutData.monthlyRent || '-'}</span>
                </div>

                <div className="detail-item">
                  <div className="detail-item-left">
                    <Calendar size={16} className="detail-icon" />
                    <span className="detail-label">Due Date</span>
                  </div>
                  <span className="detail-value">{checkoutData.dueDate || '-'}</span>
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
                  <div className="method-logo-wrap">
                    <img src="/Gpay.png" alt="Google Pay" />
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
                  <div className="method-logo-wrap">
                    <img src="/Phonepay.png" alt="PhonePe" />
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
                  <div className="method-logo-wrap">
                    <img src="/paytm.png" alt="Paytm" />
                  </div>
                  <div className="method-info">
                    <span className="method-name">Paytm</span>
                    <span className="method-sub">Pay using Paytm</span>
                  </div>
                </div>

              </div>

              <div className="pay-button-wrap">
                <button 
                  className="pay-button"
                  onClick={() => handlePayRedirect()}
                >
                  <Lock size={18} />
                  Pay ₹{checkoutData.monthlyRent || '6,000'}
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
              
              <label className="file-upload-zone" style={{ cursor: isScanning ? 'wait' : 'pointer', opacity: isScanning ? 0.7 : 1 }}>
                <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/png, image/jpeg" disabled={isScanning} />
                <div className="file-choose-btn">
                  <FileText size={14} />
                  Choose File
                </div>
                <span className="file-name-text">{file ? file.name : (isScanning ? 'Analyzing screenshot...' : 'No file chosen')}</span>
              </label>

              {isScanning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '12.5px', color: '#0369a1', marginBottom: '12px' }}>
                  <div className="pf-spin" style={{ display: 'inline-block' }}>⚙️</div>
                  <span>{ocrProgress || 'OCR scanning screenshot for Transaction ID...'}</span>
                </div>
              )}

              {extractedUtr && !isScanning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '12.5px', color: '#15803d', fontWeight: '600', marginBottom: '12px' }}>
                  <Check size={16} />
                  <span>Transaction ID / UTR Detected: <strong>{extractedUtr}</strong></span>
                </div>
              )}

              <div className="file-hint">Accepted formats: JPG, JPEG, PNG • Max size: 5MB</div>

              <div className="secure-alert" style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#334155', marginBottom: '20px', borderRadius: '10px' }}>
                <Info size={16} color="#1d4ed8" style={{ flexShrink: 0 }} />
                <span style={{ color: '#1d4ed8' }}>Make sure Transaction ID is clearly visible in the screenshot.</span>
              </div>

              <button 
                className={`submit-payment-btn ${file && !isScanning ? 'active' : ''}`}
                onClick={handleSubmit}
                disabled={!file || isScanning || isLoading}
              >
                <CloudUpload size={18} />
                {isLoading ? 'Submitting...' : 'Submit Payment'}
              </button>

            </div>

            <div className="secure-footer">
              <Lock size={12} />
              Your payment details are secure and encrypted.
            </div>

          </div>
        </div>
        <div className="checkout-footer-text">
          Powered by Reyaansh PG Management • 100% Secure Payment Link
        </div>
      </div>

      {/* Invalid Screenshot Error Modal */}
      {showInvalidModal && (
        <div className="modal-overlay">
          <div className="success-modal-content" style={{ borderColor: '#fca5a5' }}>
            <div className="success-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            <h2 className="success-title" style={{ color: '#991b1b', marginTop: '12px' }}>Transaction ID Not Visible</h2>
            <p className="success-subtitle" style={{ marginBottom: '16px' }}>OCR Validation Failed</p>
            
            <div className="success-divider"></div>
            
            <p className="success-text" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              The <strong>Transaction ID / UTR number</strong> is not clearly visible in this photo.
            </p>
            <p className="success-text" style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              Please upload a clear payment screenshot where the <strong>12-digit UTR</strong> or <strong>Transaction ID</strong> is readable.
            </p>
            
            <button className="close-btn" style={{ background: '#dc2626', marginTop: '20px' }} onClick={() => setShowInvalidModal(false)}>
              Upload Clear Screenshot
            </button>
          </div>
        </div>
      )}

      {/* Thank You / Greeting Page after submission */}
      {isSubmitted && (
        <div className="modal-overlay" style={{ background: '#f8fafc' }}>
          <div className="checkout-container" style={{ textAlign: 'center', padding: '48px 32px', margin: '20px', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <div style={{ width: '72px', height: '72px', background: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
              <Check size={40} strokeWidth={3} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#065f46', margin: '0 0 8px' }}>
              Payment Received & In Review! 🎉
            </h1>
            <p style={{ fontSize: '14.5px', color: '#475569', margin: '0 0 24px', lineHeight: '1.5' }}>
              Thank you, <strong>{checkoutData.memberName || 'Tenant'}</strong>! We have received your rent payment proof and it is currently being verified.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', margin: '0 auto 24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>Member Name:</span>
                <strong style={{ color: '#0f172a' }}>{checkoutData.memberName || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>PG Name:</span>
                <strong style={{ color: '#0f172a' }}>{checkoutData.pgName || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>Room Number:</span>
                <strong style={{ color: '#0f172a' }}>{checkoutData.roomNumber || '-'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <strong style={{ color: '#1d4ed8' }}>₹{checkoutData.monthlyRent || '-'}</strong>
              </div>
              {extractedUtr && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '13.5px' }}>
                  <span style={{ color: '#64748b' }}>Verified UTR / Ref No:</span>
                  <strong style={{ color: '#059669' }}>{extractedUtr}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '13.5px' }}>
                <span style={{ color: '#64748b' }}>Payment Status:</span>
                <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 10px', borderRadius: '12px', fontWeight: '600', fontSize: '12px' }}>
                  ● In Review
                </span>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', color: '#1e40af', fontSize: '13px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
              <Info size={18} color="#1d4ed8" style={{ flexShrink: 0 }} />
              <span>Our admin team will verify your transaction against bank records within 24-48 hours.</span>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0' }}>
              You may safely close this tab now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
