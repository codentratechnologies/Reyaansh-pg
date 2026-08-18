import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Active', value: 350, color: '#1e3a8a' },
  { name: 'Notice Period', value: 32, color: '#1d4ed8' },
  { name: 'Inactive', value: 10, color: '#3b82f6' },
  { name: 'Vacant / Left', value: 68, color: '#93c5fd' },
];

const MemberStatusChart = () => {
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
                data={data}
                innerRadius={0}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {data.map((item, index) => (
            <div className="legend-item" key={index} style={{ marginBottom: '8px' }}>
              <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
              <div className="legend-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="legend-name" style={{ fontSize: '11px', color: '#475569' }}>{item.name}</div>
                <div className="legend-val" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {item.value} ({(item.value / 460 * 100).toFixed(1)}%)
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
