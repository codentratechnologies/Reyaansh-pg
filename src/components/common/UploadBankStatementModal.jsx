import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, File, X } from 'lucide-react';
import Button from './Button';

const UploadBankStatementModal = ({ isOpen, onClose, onUpload }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBoxClick = () => {
    if (!selectedFile) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '480px' }}>
        <div className="modal-header" style={{ flexDirection: 'row', alignItems: 'flex-start', textAlign: 'left', paddingBottom: '16px' }}>
          <div className="modal-icon-container" style={{ background: '#eff6ff', color: '#1d4ed8', flexShrink: 0 }}>
            <UploadCloud size={24} />
          </div>
          <div className="modal-title-wrap">
            <h3 className="modal-title" style={{ textAlign: 'left' }}>Upload Bank Statement</h3>
            <p className="modal-desc" style={{ textAlign: 'left', marginTop: '4px' }}>
              Upload bank statement to verify recent payments.
            </p>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: '0 24px 24px 24px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <div 
            onClick={handleBoxClick}
            style={{ 
              border: '2px dashed #cbd5e1', 
              borderRadius: '8px', 
              padding: selectedFile ? '20px 24px' : '40px 24px', 
              textAlign: 'center', 
              cursor: selectedFile ? 'default' : 'pointer',
              background: '#f8fafc',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!selectedFile ? (
              <>
                <UploadCloud size={32} color="#1d4ed8" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#0f172a' }}>Click to upload or drag and drop</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>PDF, PNG, JPG (max. 10MB)</p>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }}>
                <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#1d4ed8' }}>
                  <File size={20} />
                </div>
                <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button onClick={handleRemoveFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUploadClick} style={{ flex: 1 }} disabled={!selectedFile}>
            Upload Statement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadBankStatementModal;
