import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MemberStatusChart = ({ data }) => {
  const chartData = [
    { name: 'Active', value: data?.active?.count || 0, color: '#1e3a8a', percentage: data?.active?.percentage || 0 },
    { name: 'Notice Period', value: data?.notice_period?.count || 0, color: '#1d4ed8', percentage: data?.notice_period?.percentage || 0 },
    { name: 'Inactive', value: data?.inactive?.count || 0, color: '#3b82f6', percentage: data?.inactive?.percentage || 0 },
    { name: 'Vacant / Left', value: data?.vacant_left?.count || 0, color: '#93c5fd', percentage: data?.vacant_left?.percentage || 0 },
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Member Status Distribution</h3>
      </div>
      <div className="chart-body" style={{ display: 'flex', alignItems: 'center', marginTop: '16px', justifyContent: 'center', gap: '32px' }}>
        <div style={{ width: '160px', height: '160px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#000000' }}
              />
              <Pie
                data={chartData}
                innerRadius={0}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {chartData.map((item, index) => (
            <div className="legend-item" key={index} style={{ marginBottom: '8px' }}>
              <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
              <div className="legend-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="legend-name" style={{ fontSize: '11px', color: '#475569' }}>{item.name}</div>
                <div className="legend-val" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {item.value} ({item.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberStatusChart;
