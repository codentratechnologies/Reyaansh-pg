import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import '../../assets/dashboard.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-warning">
            <AlertTriangle size={24} />
          </div>
          <div className="modal-header-content">
            <h3 className="modal-title">{title}</h3>
            <p className="modal-description">{description}</p>
          </div>
        </div>
        
        <div className="modal-actions">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
