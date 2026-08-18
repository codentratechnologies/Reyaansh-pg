import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../assets/dashboard.css';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="dashboard-main">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
