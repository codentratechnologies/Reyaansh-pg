import React, { useState, useRef, useEffect } from 'react';
import {
  CloudUpload, CheckCircle2, AlertCircle, Loader2,
  FileText, Image as ImageIcon, Eye, RefreshCw, X,
  ShieldCheck, Sparkles, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import { verifyAadhaarDocument } from '../../utils/aadharOcr';

const AadhaarUploadWithOcr = ({
  value,
  onChange,
  error,
  onClearError,
  onAutoFill,
  currentDob,
  currentGender
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, message: '' });
  const [verificationResult, setVerificationResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [appliedAutoFill, setAppliedAutoFill] = useState(false);

  const fileInputRef = useRef(null);

  // Generate preview URL when value changes
  useEffect(() => {
    if (value && value instanceof File) {
      if (value.type.startsWith('image/')) {
        const url = URL.createObjectURL(value);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    } else if (!value) {
      setPreviewUrl(null);
      setVerificationResult(null);
      setAppliedAutoFill(false);
    }
  }, [value]);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (onClearError) onClearError();

    // Check file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      if (onChange) onChange(null, null, 'File size must be less than 8MB');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      if (onChange) onChange(null, null, 'Only PDF or Image files (JPG, PNG, WebP) are allowed');
      return;
    }

    setIsVerifying(true);
    setProgress({ percent: 10, message: 'Starting Aadhaar verification...' });
    setVerificationResult(null);
    setAppliedAutoFill(false);

    try {
      const result = await verifyAadhaarDocument(file, ({ percent, message }) => {
        setProgress({ percent, message });
      });

      setVerificationResult(result);

      if (result.isValid) {
        // Document passed requirements (front side compulsory + score >= 50%)
        if (onChange) onChange(file, result, null);
      } else {
        // Verification failed - block file from being submitted
        if (onChange) onChange(null, result, result.rejectionReason);
      }
    } catch (err) {
      console.error('Aadhaar verification error:', err);
      const errReason = 'OCR analysis failed. Please ensure the document is clear and readable.';
      setVerificationResult({
        isValid: false,
        totalScore: 0,
        isFrontPresent: false,
        rejectionReason: errReason,
        checks: []
      });
      if (onChange) onChange(null, null, errReason);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setVerificationResult(null);
    setPreviewUrl(null);
    setAppliedAutoFill(false);
    if (onChange) onChange(null, null, null);
  };

  const handleApplyAutoFill = (e) => {
    e.stopPropagation();
    if (!verificationResult?.extractedData || !onAutoFill) return;
    onAutoFill(verificationResult.extractedData);
    setAppliedAutoFill(true);
  };

  const isPdf = value && (value.type === 'application/pdf' || value.name?.toLowerCase().endsWith('.pdf'));

  return (
    <div style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* Main Upload Box */}
      {!value && !isVerifying && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          style={{
            border: `2px dashed ${error ? '#ef4444' : '#cbd5e1'}`,
            backgroundColor: error ? '#fef2f2' : '#f8fafc',
            borderRadius: '12px',
            padding: '20px 14px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}
          className="hover:border-blue-500 hover:bg-blue-50/50"
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            color: '#2563eb',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
          }}>
            <CloudUpload size={22} />
          </div>

          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px', wordBreak: 'break-word' }}>
            Click to upload or drag & drop Aadhaar
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', wordBreak: 'break-word' }}>
            Supports PDF, JPG, PNG or WebP (Max 8MB)
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: '#f1f5f9',
            borderRadius: '20px',
            fontSize: '11px',
            color: '#475569',
            fontWeight: '500',
            maxWidth: '100%',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            <ShieldCheck size={14} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ wordBreak: 'break-word' }}>Front side compulsory (Min 50% match)</span>
          </div>
        </div>
      )}

      {/* Verification In Progress State */}
      {isVerifying && (
        <div style={{
          border: '1.5px solid #3b82f6',
          backgroundColor: '#eff6ff',
          borderRadius: '12px',
          padding: '20px 14px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <Loader2 size={20} className="animate-spin" color="#2563eb" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1d4ed8' }}>
              OCR Document Analysis in Progress
            </span>
          </div>

          <p style={{ fontSize: '12.5px', color: '#3b82f6', margin: '0 0 12px', wordBreak: 'break-word' }}>
            {progress.message || 'Scanning text and validating Aadhaar security markers...'}
          </p>

          <div style={{
            width: '100%',
            maxWidth: '320px',
            height: '7px',
            backgroundColor: '#dbeafe',
            borderRadius: '4px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress.percent}%`,
              height: '100%',
              backgroundColor: '#2563eb',
              transition: 'width 0.3s ease',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ fontSize: '11.5px', color: '#60a5fa', marginTop: '6px', fontWeight: '600' }}>
            {progress.percent}% Completed
          </div>
        </div>
      )}

      {/* Verification Passed State */}
      {value && !isVerifying && verificationResult?.isValid && (
        <div style={{
          border: '1.5px solid #10b981',
          backgroundColor: '#f0fdf4',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.06)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>
          {/* Top Row: Thumbnail + Info & Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              minWidth: 0,
              flex: '1 1 200px'
            }}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Aadhaar Preview"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid #bbf7d0',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                  onClick={() => setShowPreviewModal(true)}
                  title="Click to view full preview"
                />
              ) : (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#dcfce7',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  flexShrink: 0
                }}>
                  {isPdf ? <FileText size={24} /> : <ImageIcon size={24} />}
                </div>
              )}

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#065f46' }}>
                    Aadhaar Card Verified
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: '#d1fae5',
                    color: '#047857',
                    padding: '1px 7px',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0'
                  }}>
                    {verificationResult.totalScore}% Match
                  </span>
                </div>

                <div style={{
                  fontSize: '11.5px',
                  color: '#475569',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '2px'
                }} title={value.name}>
                  {value.name} ({(value.size / 1024).toFixed(0)} KB)
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '5px',
                  marginTop: '3px',
                  fontSize: '11px',
                  color: '#059669',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  <CheckCircle2 size={13} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ wordBreak: 'break-word' }}>
                    {verificationResult.isBackPresent
                      ? 'Front & Back side verified (Eligible to submit)'
                      : 'Front side verified (Eligible to submit)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: View & Remove */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              marginLeft: 'auto'
            }}>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11.5px',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                  title="Preview document"
                >
                  <Eye size={13} />
                  View
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11.5px',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
                title="Change or remove file"
              >
                <X size={13} />
                Remove
              </button>
            </div>
          </div>

          {/* Quick Auto-fill suggestion if DOB or Gender detected */}
          {(verificationResult.extractedData?.dob || verificationResult.extractedData?.gender) && onAutoFill && !appliedAutoFill && (
            <div style={{
              marginTop: '10px',
              padding: '8px 10px',
              backgroundColor: '#ecfdf5',
              border: '1px dashed #10b981',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexWrap: 'wrap',
              boxSizing: 'border-box'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                color: '#065f46',
                minWidth: 0,
                flex: '1 1 180px'
              }}>
                <Sparkles size={14} color="#059669" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word', lineHeight: '1.3' }}>
                  Detected: 
                  {verificationResult.extractedData.dob && <strong> DOB: {verificationResult.extractedData.dob}</strong>}
                  {verificationResult.extractedData.gender && <strong> | Gender: {verificationResult.extractedData.gender}</strong>}
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyAutoFill}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
                className="w-full sm:w-auto"
              >
                <Check size={13} />
                Auto-fill in Form
              </button>
            </div>
          )}

          {appliedAutoFill && (
            <div style={{ marginTop: '6px', fontSize: '11.5px', color: '#059669', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={13} /> Form fields populated with detected Aadhaar details!
            </div>
          )}

          {/* Verification Details Accordion Toggle */}
          <div style={{ marginTop: '8px', borderTop: '1px solid #d1fae5', paddingTop: '6px' }}>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                color: '#047857',
                fontSize: '11.5px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              {showDetails ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              <span>{showDetails ? 'Hide Verification Breakdown' : 'View Security Checks Breakdown'}</span>
            </button>

            {showDetails && (
              <div style={{
                marginTop: '6px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '6px'
              }}>
                {verificationResult.checks?.map((check) => (
                  <div
                    key={check.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: check.passed ? '#ecfdf5' : '#f8fafc',
                      border: `1px solid ${check.passed ? '#a7f3d0' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      color: check.passed ? '#065f46' : '#64748b',
                      minWidth: 0,
                      overflow: 'hidden'
                    }}
                  >
                    {check.passed ? (
                      <CheckCircle2 size={12} color="#059669" style={{ flexShrink: 0 }} />
                    ) : (
                      <span style={{ width: '12px', textAlign: 'center', fontWeight: 'bold', flexShrink: 0 }}>-</span>
                    )}
                    <span style={{ fontWeight: check.passed ? '600' : 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification Failed State - Compact, Responsive One-Line Warning */}
      {!isVerifying && verificationResult && !verificationResult.isValid && (
        <div
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '12px',
            boxShadow: '0 1px 2px rgba(239, 68, 68, 0.04)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            flexWrap: 'wrap'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              color: '#991b1b',
              minWidth: 0,
              flex: '1 1 180px'
            }}
          >
            <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ wordBreak: 'break-word', lineHeight: '1.3' }}>
              <strong style={{ fontWeight: '600' }}>Verification Failed ({verificationResult.totalScore}%):</strong>{' '}
              Front side of Aadhaar card is compulsory (min. 50% match required).
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              title="Upload another document"
            >
              <RefreshCw size={11} />
              Retry
            </button>
            <button
              type="button"
              onClick={() => setVerificationResult(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#991b1b',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              title="Dismiss warning"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* External Error Display */}
      {error && !verificationResult && (
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          wordBreak: 'break-word',
          maxWidth: '100%'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                Aadhaar Document Preview
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
              <img
                src={previewUrl}
                alt="Uploaded Aadhaar"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AadhaarUploadWithOcr;
