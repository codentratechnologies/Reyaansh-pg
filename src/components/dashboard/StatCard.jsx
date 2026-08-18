import React from 'react';

const StatCard = ({ icon, title, value, subtext, subtextRight, iconBg, trendUp, accentClass = '' }) => {
  return (
    <div className={`stat-card ${accentClass}`}>
      <div className="stat-card-top">
        <div className="stat-icon" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        <div className="stat-title">{title}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-bottom">
        <span className={`stat-trend ${trendUp !== undefined ? (trendUp ? 'trend-up' : 'trend-down') : ''}`}>
          {subtext}
        </span>
        {subtextRight && <span className="stat-sub-right">• {subtextRight}</span>}
      </div>
    </div>
  );
};

export default StatCard;
