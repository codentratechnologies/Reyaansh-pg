import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, CheckCircle2 } from 'lucide-react';
import './profile.css';

const Profile = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="profile-page">

      {/* ── Header Card ───────────────────────────────── */}
      <div className="profile-header-card">
        <div className="profile-cover" />
        <div className="profile-header-body">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">A</div>
            <button className="profile-cam-btn" title="Change photo">
              <Camera size={13} />
            </button>
          </div>
          <div className="profile-identity">
            <h1 className="profile-name">Admin User</h1>
            <span className="profile-role-badge">Administrator</span>
          </div>
          <div className="profile-meta-chips">
            <span className="profile-chip"><Mail size={13} /> admin@reyaansh.com</span>
            <span className="profile-chip"><Phone size={13} /> +91 9876543210</span>
            <span className="profile-chip"><MapPin size={13} /> Bengaluru, Karnataka</span>
          </div>
        </div>
      </div>

      {/* ── Two Cards Below ───────────────────────────── */}
      <div className="profile-cards-row">

        {/* Personal Information */}
        <div className="profile-card profile-card-single">
          <div className="profile-card-title-row">
            <div className="profile-card-dot bg-blue-dot" />
            <h2 className="profile-card-heading">Personal Information</h2>
          </div>
          <div className="profile-fields">
            <div className="profile-row-2">
              <div className="pf-group">
                <label className="pf-label">First Name</label>
                <input className="pf-input" type="text" defaultValue="Admin" />
              </div>
              <div className="pf-group">
                <label className="pf-label">Last Name</label>
                <input className="pf-input" type="text" defaultValue="User" />
              </div>
            </div>
            <div className="pf-group">
              <label className="pf-label">Email Address</label>
              <input className="pf-input" type="email" defaultValue="admin@reyaansh.com" />
            </div>
            <div className="pf-group">
              <label className="pf-label">Phone Number</label>
              <input className="pf-input" type="tel" defaultValue="+91 9876543210" />
            </div>
            <div className="pf-group">
              <label className="pf-label">Location</label>
              <input className="pf-input" type="text" defaultValue="Bengaluru, Karnataka" />
            </div>
          </div>
          <div className="profile-card-footer">
            <button className={`pf-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
              {saved
                ? <><CheckCircle2 size={15} /> Saved!</>
                : <><Save size={15} /> Save Changes</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
