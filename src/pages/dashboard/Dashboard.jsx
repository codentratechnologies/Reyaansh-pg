import React, { useState } from 'react';
import { Filter, RotateCcw, Building2, BedDouble, Users, PieChart, Wallet, Receipt } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

import OccupancyChart from '../../components/dashboard/charts/OccupancyChart';
import RevenueTrendChart from '../../components/dashboard/charts/RevenueTrendChart';
import MemberStatusChart from '../../components/dashboard/charts/MemberStatusChart';
import RevenueByPGChart from '../../components/dashboard/charts/RevenueByPGChart';

import RentDueTable from '../../components/dashboard/tables/RentDueTable';
import RecentPaymentsTable from '../../components/dashboard/tables/RecentPaymentsTable';
import RentOverdueAlert from '../../components/dashboard/tables/RentOverdueAlert';
import PendingApprovalsAlert from '../../components/dashboard/tables/PendingApprovalsAlert';
import DashboardFiltersModal from '../../components/dashboard/DashboardFiltersModal';

const Dashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  return (
    <div className="dashboard-page">
      {/* Top Action Bar */}
      <div className="dashboard-top-bar" style={{ justifyContent: 'flex-end' }}>
        <div className="top-actions">
          <button className="action-btn filter-btn" onClick={() => setIsFilterModalOpen(true)} title="Filter">
            <Filter size={16} color="#1a56db" />
            <span className="hide-on-mobile" style={{ color: '#1a56db', fontWeight: 600 }}>Filter</span>
          </button>
          <button className="action-btn" title="Reset">
            <RotateCcw size={16} />
            <span className="hide-on-mobile">Reset</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <StatCard 
          icon={<Building2 size={22} color="#1a56db" />}
          iconBg="#eff6ff"
          title="Total PGs"
          value="12"
          subtext={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#16a34a' }}>11 Active</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#dc2626' }}>1 Inactive</span>
            </div>
          }
        />
        <StatCard 
          icon={<BedDouble size={22} color="#1a56db" />}
          iconBg="#eff6ff"
          title="Total Rooms"
          value="450"
          subtext={<span style={{ color: '#64748b' }}>Total Rooms</span>}
        />
        <StatCard 
          icon={<Users size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Total Members"
          value="382"
          accentClass="accent-green"
          subtext={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#16a34a' }}>350 Active</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#ea580c' }}>32 Notice</span>
            </div>
          }
        />
        <StatCard 
          icon={<PieChart size={22} color="#7c3aed" />}
          iconBg="#f3e8ff"
          title="Occupancy Rate"
          value="85%"
          accentClass="accent-purple"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>Occupied Beds</span>
              <span style={{ color: '#16a34a' }}>↑ 2.5% vs Last Month</span>
            </div>
          }
        />
        <StatCard 
          icon={<Wallet size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Rent Collected"
          value="₹3.80M"
          accentClass="accent-green"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>This Month</span>
              <span style={{ color: '#16a34a' }}>↑ 12.4% vs Last Month</span>
            </div>
          }
        />
        <StatCard 
          icon={<Receipt size={22} color="#ea580c" />}
          iconBg="#fff7ed"
          title="Pending Rent"
          value="₹350K"
          accentClass="accent-orange"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>From 45 Members</span>
              <span style={{ color: '#dc2626' }}>↑ 8.7% vs Last Month</span>
            </div>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <OccupancyChart />
        <MemberStatusChart />
        <RevenueTrendChart />
        <RevenueByPGChart />
      </div>

      {/* Tables Row */}
      {/* Standard Tables Row */}
      <div className="tables-grid">
        <RentDueTable />
        <RecentPaymentsTable />
      </div>

      {/* Alert Tables Row */}
      <div className="tables-grid">
        <RentOverdueAlert />
        <PendingApprovalsAlert />
      </div>


      {/* Filters Modal */}
      <DashboardFiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
