import React, { useState, useEffect } from 'react';
import { 
  Menu, LayoutDashboard, Building2, Users, User, 
  CreditCard, PlusCircle, Edit, Eye 
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ setIsSidebarOpen }) => {
  const [greeting, setGreeting] = useState('');
  const location = useLocation();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning ☀️');
    else if (hour < 17) setGreeting('Good Afternoon 🌤️');
    else setGreeting('Good Evening 🌙');
  }, []);

  const getSectionDetails = () => {
    const path = location.pathname;
    if (path === '/pg-management/add') return { title: 'Add New PG', Icon: PlusCircle };
    if (path.startsWith('/pg-management/edit/')) return { title: 'Edit PG', Icon: Edit };
    if (path.startsWith('/pg-management/view/')) return { title: 'View PG', Icon: Eye };
    if (path.startsWith('/pg-management')) return { title: 'PG Management', Icon: Building2 };
    
    if (path === '/member-management/add') return { title: 'Add New Member', Icon: PlusCircle };
    if (path.startsWith('/member-management/edit/')) return { title: 'Edit Member', Icon: Edit };
    if (path.startsWith('/member-management/view/')) return { title: 'View Member', Icon: Eye };
    if (path.startsWith('/member-management')) return { title: 'Member Management', Icon: Users };
    
    if (path.startsWith('/profile')) return { title: 'Admin Profile', Icon: User };
    if (path.startsWith('/checkout')) return { title: 'Checkout', Icon: CreditCard };
    
    return { title: 'Dashboard', Icon: LayoutDashboard };
  };

  const { title, Icon } = getSectionDetails();

  return (
    <header className="dashboard-header">
      {/* Left */}
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} color="#1e293b" />
        </button>
        <div className="header-title-wrapper">
          {Icon && <Icon className="header-title-icon" size={24} color="#1d4ed8" />}
          <h2 className="header-page-title">
            {title}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="header-right hide-on-mobile">
        <span className="header-greeting">
          {greeting}
        </span>
      </div>
    </header>
  );
};

export default Header;
