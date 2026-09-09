import React, { useState, useEffect } from 'react';
import { Filter, Building2, BedDouble, Users, PieChart, Wallet, Receipt } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import api from '../../utils/api';

import OccupancyChart from '../../components/dashboard/charts/OccupancyChart';
import RevenueTrendChart from '../../components/dashboard/charts/RevenueTrendChart';
import MemberStatusChart from '../../components/dashboard/charts/MemberStatusChart';
import RevenueByPGChart from '../../components/dashboard/charts/RevenueByPGChart';

import RentDueTable from '../../components/dashboard/tables/RentDueTable';
import RecentPaymentsTable from '../../components/dashboard/tables/RecentPaymentsTable';
import RentOverdueAlert from '../../components/dashboard/tables/RentOverdueAlert';
import PendingApprovalsAlert from '../../components/dashboard/tables/PendingApprovalsAlert';
import DashboardFiltersModal from '../../components/dashboard/DashboardFiltersModal';

const formatCurrency = (val) => {
  if (!val) return '₹0';
  if (val >= 1000000) return `₹${(val / 1000000).toFixed(2)}M`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const Dashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [tablesData, setTablesData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [kpiRes, chartRes, tablesRes, alertsRes] = await Promise.all([
          api.get('/api/dashboard-kpis/', { params: activeFilters }),
          api.get('/api/dashboard-charts/', { params: activeFilters }),
          api.get('/api/dashboard-tables/', { params: activeFilters }),
          api.get('/api/dashboard-alerts/', { params: activeFilters })
        ]);
        
        if (kpiRes.data?.kpis) {
          setKpiData(kpiRes.data.kpis);
        }
        if (chartRes.data) {
          setChartData(chartRes.data);
        }
        if (tablesRes.data) {
          setTablesData(tablesRes.data);
        }
        if (alertsRes.data) {
          setAlertsData(alertsRes.data);
        }
      } catch (error) {
        console.error("Failed to load Dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [activeFilters]);

  return (
    <div className="dashboard-page">
      {/* Top Action Bar */}
      <div className="dashboard-top-bar" style={{ justifyContent: 'flex-end' }}>
        <div className="top-actions">
          <button className="action-btn filter-btn" onClick={() => setIsFilterModalOpen(true)} title="Filter" style={{ position: 'relative' }}>
            <Filter size={16} color="#1a56db" />
            <span className="hide-on-mobile" style={{ color: '#1a56db', fontWeight: 600 }}>Filter</span>
            {Object.values(activeFilters).some(v => v !== '') && (
              <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#dc2626', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <StatCard 
          icon={<Building2 size={22} color="#1a56db" />}
          iconBg="#eff6ff"
          title="Total PGs"
          value={isLoading ? "..." : kpiData?.total_pgs?.value || "0"}
          subtext={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#16a34a' }}>{kpiData?.total_pgs?.active || 0} Active</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#dc2626' }}>{kpiData?.total_pgs?.inactive || 0} Inactive</span>
            </div>
          }
        />
        <StatCard 
          icon={<BedDouble size={22} color="#1a56db" />}
          iconBg="#eff6ff"
          title="Total Rooms"
          value={isLoading ? "..." : kpiData?.total_rooms || "0"}
          subtext={<span style={{ color: '#64748b' }}>Total Rooms</span>}
        />
        <StatCard 
          icon={<Users size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Total Members"
          value={isLoading ? "..." : kpiData?.total_members?.value || "0"}
          accentClass="accent-green"
          subtext={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#16a34a' }}>{kpiData?.total_members?.active || 0} Active</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#ea580c' }}>{kpiData?.total_members?.notice || 0} Notice</span>
            </div>
          }
        />
        <StatCard 
          icon={<PieChart size={22} color="#7c3aed" />}
          iconBg="#f3e8ff"
          title="Occupancy Rate"
          value={isLoading ? "..." : `${kpiData?.occupancy_rate?.percentage || 0}%`}
          accentClass="accent-purple"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>{kpiData?.occupancy_rate?.occupied || 0} Occupied Beds</span>
              {kpiData?.occupancy_rate?.trend && (
                <span style={{ color: kpiData.occupancy_rate.trend.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                  {kpiData.occupancy_rate.trend} vs Last Month
                </span>
              )}
            </div>
          }
        />
        <StatCard 
          icon={<Wallet size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Rent Collected"
          value={isLoading ? "..." : formatCurrency(kpiData?.rent_collected?.amount)}
          accentClass="accent-green"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>This Month</span>
              {kpiData?.rent_collected?.trend && (
                <span style={{ color: kpiData.rent_collected.trend.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                  {kpiData.rent_collected.trend} vs Last Month
                </span>
              )}
            </div>
          }
        />
        <StatCard 
          icon={<Receipt size={22} color="#ea580c" />}
          iconBg="#fff7ed"
          title="Pending Rent"
          value={isLoading ? "..." : formatCurrency(kpiData?.pending_rent?.amount)}
          accentClass="accent-orange"
          subtext={
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ color: '#64748b' }}>From {kpiData?.pending_rent?.members || 0} Members</span>
              {kpiData?.pending_rent?.trend && (
                <span style={{ color: kpiData.pending_rent.trend.startsWith('+') ? '#dc2626' : '#16a34a' }}>
                  {kpiData.pending_rent.trend} vs Last Month
                </span>
              )}
            </div>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <OccupancyChart data={chartData?.occupancy_overview} />
        <MemberStatusChart data={chartData?.member_status_distribution} />
        <RevenueTrendChart data={chartData?.monthly_rent_collection_trend} />
        <RevenueByPGChart data={chartData?.revenue_by_pg} />
      </div>

      {/* Tables Row */}
      {/* Standard Tables Row */}
      <div className="tables-grid">
        <RentDueTable data={tablesData?.upcoming_rent_due} />
        <RecentPaymentsTable data={tablesData?.recent_payments} />
      </div>

      {/* Alert Tables Row */}
      <div className="tables-grid">
        <RentOverdueAlert data={alertsData?.rent_overdue} />
        <PendingApprovalsAlert data={alertsData?.pending_approvals} />
      </div>


      {/* Filters Modal */}
      <DashboardFiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        activeFilters={activeFilters}
        onApplyFilters={setActiveFilters}
      />
    </div>
  );
};

export default Dashboard;
