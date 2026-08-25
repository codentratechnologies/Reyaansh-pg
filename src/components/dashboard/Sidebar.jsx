import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';
import { LayoutDashboard, Building2, Users, Headphones, LogOut, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <img src="/logo.png" alt="Reyaansh PG Logo" style={{ width: '44px', height: '44px', objectFit: 'contain', transform: 'scale(1.2)' }} />
          </div>
          <div className="sidebar-brand-text">
            <h2>Reeyaansh Living PG</h2>
            <p>Enterprise Admin</p>
          </div>
          <button className="sidebar-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setIsOpen(false)}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/pg-management" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setIsOpen(false)}>
                <Building2 size={20} />
                <span>PG Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/member-management" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={() => setIsOpen(false)}>
                <Users size={20} />
                <span>Member Management</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">

          <div className="user-profile" onClick={() => { navigate('/profile'); setIsOpen(false); }} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">
              A
            </div>
            <div className="user-info">
              <span className="user-name">Welcome, Admin</span>
              <span className="user-role">Administrator</span>
            </div>
            <button className="user-logout-btn" onClick={(e) => { e.stopPropagation(); setIsLogoutModalOpen(true); }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          logout();
          navigate('/');
        }}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
      />
    </>
  );
};

export default Sidebar;
