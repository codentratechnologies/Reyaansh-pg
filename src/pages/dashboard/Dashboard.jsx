import React, { useState, useEffect } from 'react';
import { Filter, Building2, BedDouble, Users, AlertCircle, Wallet, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
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
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
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
      {/* Top Action Bar & KPI Header */}
      <div className="dashboard-top-bar" style={{ marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Quick Summary</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>A fast look at your properties and money</p>
        </div>
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
        />
        <StatCard 
          icon={<BedDouble size={22} color="#1a56db" />}
          iconBg="#eff6ff"
          title="Total Rooms"
          value={isLoading ? "..." : kpiData?.total_rooms || "0"}
        />
        <StatCard 
          icon={<Users size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Total Members"
          value={isLoading ? "..." : kpiData?.total_members?.value || "0"}
          accentClass="accent-green"
        />
        <StatCard 
          icon={<AlertCircle size={22} color="#dc2626" />}
          iconBg="#fef2f2"
          title="Total Overdue Rent"
          value={isLoading ? "..." : "₹0"}
          accentClass="accent-red"
        />
        <StatCard 
          icon={<Wallet size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Rent Collected"
          value={isLoading ? "..." : formatCurrency(kpiData?.rent_collected?.amount)}
          accentClass="accent-green"
        />
        <StatCard 
          icon={<Receipt size={22} color="#ea580c" />}
          iconBg="#fff7ed"
          title="Pending Rent"
          value={isLoading ? "..." : formatCurrency(kpiData?.pending_rent?.amount)}
          accentClass="accent-orange"
        />
        <StatCard 
          icon={<TrendingUp size={22} color="#16a34a" />}
          iconBg="#f0fdf4"
          title="Total Profit"
          value={isLoading ? "..." : "₹0"}
          accentClass="accent-green"
        />
        <StatCard 
          icon={<TrendingDown size={22} color="#dc2626" />}
          iconBg="#fef2f2"
          title="Total Expense"
          value={isLoading ? "..." : "₹0"}
          accentClass="accent-red"
        />
      </div>

      {/* Analytics Charts Section Header */}
      <div style={{ marginBottom: '16px', marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Charts</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Visual look at beds and income</p>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <OccupancyChart data={chartData?.occupancy_overview} />
        <MemberStatusChart data={chartData?.member_status_distribution} />
        <RevenueTrendChart data={chartData?.monthly_rent_collection_trend} />
        <RevenueByPGChart data={chartData?.revenue_by_pg} />
      </div>

      {/* Data Tables Section Header */}
      <div style={{ marginBottom: '16px', marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Payments & Dues</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Who needs to pay and recent payments</p>
      </div>

      {/* Tables Row */}
      {/* Standard Tables Row */}
      <div className="tables-grid">
        <RentDueTable data={tablesData?.upcoming_rent_due} />
        <RecentPaymentsTable data={tablesData?.recent_payments} />
      </div>

      {/* Alerts Section Header */}
      <div style={{ marginBottom: '16px', marginTop: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Needs Attention</h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Important things you need to look at right now</p>
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
