import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Save, CheckCircle2, Shield, Edit3, LogOut, X, User, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/common/ConfirmModal';
import api from '../../utils/api';
import './profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
  });

  const [draft, setDraft] = useState({ ...formData });

  // ── Load existing data via PUT on mount ────────────
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Call PUT with empty body — backend returns current profile data
        const res = await api.put('/api/admin-profile/', {});
        const data = res.data || {};
        const loaded = {
          firstName: data.first_name || data.firstName || '',
          lastName:  data.last_name  || data.lastName  || '',
          email:     data.email      || '',
          phone:     data.phone      || data.mobile    || '',
          location:  data.location   || data.city      || '',
        };
        setFormData(loaded);
        setDraft(loaded);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Could not load profile data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleEdit = () => {
    setDraft({ ...formData });
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...formData });
    setError('');
    setIsEditing(false);
  };

  // ── Save via PUT /api/admin-profile/ ───────────────
  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const payload = {
        first_name: draft.firstName,
        last_name:  draft.lastName,
        email:      draft.email,
        phone:      draft.phone,
        location:   draft.location,
      };
      const res = await api.put('/api/admin-profile/', payload);
      // Update formData from the response if backend returns updated data
      const data = res.data || {};
      const updated = {
        firstName: data.first_name || draft.firstName,
        lastName:  data.last_name  || draft.lastName,
        email:     data.email      || draft.email,
        phone:     data.phone      || draft.phone,
        location:  data.location   || draft.location,
      };
      setFormData(updated);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      const msg = err.response?.data?.detail
        || err.response?.data?.message
        || Object.values(err.response?.data || {})[0]
        || 'Failed to save. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setDraft(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = formData.firstName || formData.lastName
    ? `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase()
    : 'A';

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
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {isLoading ? <Loader2 size={28} className="profile-avatar-spinner" /> : initials}
            </div>
            <div className="profile-avatar-ring" />
          </div>

          <div className="profile-hero-info">
            {isLoading ? (
              <div className="profile-skeleton-wrap">
                <div className="profile-skeleton profile-skeleton-name" />
                <div className="profile-skeleton profile-skeleton-chip" />
              </div>
            ) : (
              <>
                <h1 className="profile-name">{formData.firstName} {formData.lastName}</h1>
                <div className="profile-badges-row">
                  <span className="profile-role-badge"><Shield size={11} /> Administrator</span>
                  <span className="profile-status-badge">● Active</span>
                </div>
                <div className="profile-meta-chips">
                  {formData.email    && <span className="profile-chip"><Mail size={12} /> {formData.email}</span>}
                  {formData.phone    && <span className="profile-chip"><Phone size={12} /> {formData.phone}</span>}
                  {formData.location && <span className="profile-chip"><MapPin size={12} /> {formData.location}</span>}
                </div>
              </>
            )}
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
          {!isEditing && !isLoading && (
            <button className="pf-edit-btn" onClick={handleEdit}>
              <Edit3 size={14} /> Edit Profile
            </button>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="pf-error-banner">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="profile-panel-body">
          {isLoading ? (
            <div className="pf-loading-fields">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="pf-group">
                  <div className="profile-skeleton pf-skel-label" />
                  <div className="profile-skeleton pf-skel-input" />
                </div>
              ))}
            </div>
          ) : (
            <>
          <div className="pf-row-2">
                {[
                  { label: 'First Name', name: 'firstName' },
                  { label: 'Last Name',  name: 'lastName'  },
                ].map(({ label, name }) => (
                  <div className="pf-group" key={name}>
                    <label className="pf-label">{label}</label>
                    {isEditing
                      ? <input className="pf-input" type="text" name={name} value={draft[name]} onChange={handleChange} placeholder={label} />
                      : <div className="pf-value">{formData[name] || '—'}</div>
                    }
                  </div>
                ))}
              </div>

              {[
                { label: 'Email Address', name: 'email',    icon: <Mail size={16} />,   type: 'email' },
                { label: 'Phone Number',  name: 'phone',    icon: <Phone size={16} />,  type: 'tel'   },
                { label: 'Location',      name: 'location', icon: <MapPin size={16} />, type: 'text'  },
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
                      {formData[name] || '—'}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="profile-panel-footer">
          <button className="pf-logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut size={15} /> Logout
          </button>

          {isEditing ? (
            <div className="pf-action-group">
              <button className="pf-cancel-btn" onClick={handleCancel} disabled={isSaving}>
                <X size={15} /> Cancel
              </button>
              <button className="pf-save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving
                  ? <><Loader2 size={15} className="pf-spin" /> Saving...</>
                  : <><Save size={15} /> Save Changes</>}
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
