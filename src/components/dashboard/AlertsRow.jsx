import React from 'react';
import { AlertCircle, BarChart3, UserCheck, CalendarDays, Building2, ChevronRight } from 'lucide-react';

const alertsData = [
  {
    id: 1,
    icon: <AlertCircle size={20} color="#dc2626" />,
    bg: '#fef2f2',
    title: '5 Overdue Rents',
    titleColor: '#dc2626',
    desc: 'Total outstanding amount',
    boldDesc: '₹350,000'
  },
  {
    id: 2,
    icon: <BarChart3 size={20} color="#ea580c" />,
    bg: '#fff7ed',
    title: '2 Low Occupancy PGs',
    titleColor: '#ea580c',
    desc: 'Occupancy below 50%',
  },
  {
    id: 3,
    icon: <UserCheck size={20} color="#ea580c" />,
    bg: '#fff7ed',
    title: '8 Members in Notice Period',
    titleColor: '#ea580c',
    desc: 'Check upcoming vacancies',
  },
  {
    id: 4,
    icon: <CalendarDays size={20} color="#1a56db" />,
    bg: '#eff6ff',
    title: '3 Rent Due Today',
    titleColor: '#1a56db',
    desc: 'Total amount due',
    boldDesc: '₹36,000'
  },
  {
    id: 5,
    icon: <Building2 size={20} color="#7c3aed" />,
    bg: '#f3e8ff',
    title: '1 Inactive PG',
    titleColor: '#7c3aed',
    desc: 'Requires attention',
  }
];

const AlertsRow = () => {
  return (
    <div className="alerts-section">
      <h3 className="section-title">Alerts & Notifications</h3>
      <div className="alerts-grid">
        {alertsData.map((alert) => (
          <div className="alert-card" key={alert.id} style={{ backgroundColor: alert.bg }}>
            <div className="alert-content">
              <div className="alert-icon">
                {alert.icon}
              </div>
              <div className="alert-text">
                <div className="alert-title" style={{ color: alert.titleColor }}>{alert.title}</div>
                <div className="alert-desc">
                  {alert.desc} {alert.boldDesc && <><br/><strong>{alert.boldDesc}</strong></>}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#64748b" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsRow;
