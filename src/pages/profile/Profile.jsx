import React, { useState } from 'react';
import { Mail, Phone, MapPin, Save, CheckCircle2, Shield, Edit3, LogOut, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import './profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@reyaansh.com',
    phone: '+91 9876543210',
    location: 'Bengaluru, Karnataka',
  });

  const [draft, setDraft] = useState({ ...formData });

  const handleEdit = () => {
    setDraft({ ...formData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...formData });
    setIsEditing(false);
  };

  const handleSave = () => {
    setFormData({ ...draft });
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (e) => {
    setDraft(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="profile-page">

      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="profile-hero">
        <div className="profile-hero-bg">
          <div className="profile-hero-orb profile-hero-orb-1" />
          <div className="profile-hero-orb profile-hero-orb-2" />
          <div className="profile-hero-orb profile-hero-orb-3" />
          <div className="profile-hero-grid" />
        </div>

        <div className="profile-hero-content">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-avatar-ring" />
          </div>

          {/* Identity */}
          <div className="profile-hero-info">
            <h1 className="profile-name">{formData.firstName} {formData.lastName}</h1>
            <div className="profile-badges-row">
              <span className="profile-role-badge"><Shield size={11} /> Administrator</span>
              <span className="profile-status-badge">● Active</span>
            </div>
            <div className="profile-meta-chips">
              <span className="profile-chip"><Mail size={12} /> {formData.email}</span>
              <span className="profile-chip"><Phone size={12} /> {formData.phone}</span>
              <span className="profile-chip"><MapPin size={12} /> {formData.location}</span>
            </div>
          </div>


        </div>
      </div>

      {/* ── Info Card ─────────────────────────────────────── */}
      <div className="profile-panel">

        {/* Card Header */}
        <div className="profile-panel-header">
          <div className="profile-panel-header-left">
            <div className="profile-panel-icon-wrap">
              <User size={16} />
            </div>
            <div>
              <h2 className="profile-panel-title">Personal Information</h2>
              <p className="profile-panel-desc">
                {isEditing
                  ? 'Make your changes below and save when done.'
                  : 'Your profile details and contact information.'}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button className="pf-edit-btn" onClick={handleEdit}>
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* Fields */}
        <div className="profile-panel-body">
          <div className="pf-row-2">
            {[
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
            ].map(({ label, name }) => (
              <div className="pf-group" key={name}>
                <label className="pf-label">{label}</label>
                {isEditing
                  ? <input className="pf-input" type="text" name={name} value={draft[name]} onChange={handleChange} placeholder={label} />
                  : <div className="pf-value">{formData[name]}</div>
                }
              </div>
            ))}
          </div>

          {[
            { label: 'Email Address', name: 'email', icon: <Mail size={16} />, type: 'email' },
            { label: 'Phone Number', name: 'phone', icon: <Phone size={16} />, type: 'tel' },
            { label: 'Location', name: 'location', icon: <MapPin size={16} />, type: 'text' },
          ].map(({ label, name, icon, type }) => (
            <div className="pf-group" key={name}>
              <label className="pf-label">{label}</label>
              {isEditing ? (
                <div className="pf-input-icon-wrap">
                  <span className="pf-input-icon">{icon}</span>
                  <input className="pf-input pf-input-with-icon" type={type} name={name} value={draft[name]} onChange={handleChange} placeholder={label} />
                </div>
              ) : (
                <div className="pf-value pf-value-with-icon">
                  <span className="pf-value-icon">{icon}</span>
                  {formData[name]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="profile-panel-footer">
          <button className="pf-logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut size={15} /> Logout
          </button>

          {isEditing ? (
            <div className="pf-action-group">
              <button className="pf-cancel-btn" onClick={handleCancel}>
                <X size={15} /> Cancel
              </button>
              <button className="pf-save-btn" onClick={handleSave}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          ) : saved ? (
            <div className="pf-saved-indicator">
              <CheckCircle2 size={15} /> Changes saved successfully
            </div>
          ) : null}
        </div>
      </div>



      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        confirmText="Logout"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Profile;
