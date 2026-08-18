import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Occupied Beds', value: 382, color: '#1a56db' },
  { name: 'Vacant Beds', value: 68, color: '#e2e8f0' },
];

const OccupancyChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Occupancy Overview</h3>
      </div>
      <div className="chart-body" style={{ display: 'flex', alignItems: 'center', marginTop: '16px', justifyContent: 'center', gap: '32px' }}>
        <div style={{ width: '160px', height: '160px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#000000' }}
              />
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
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
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1a56db' }}></span>
            <div className="legend-text">
              <div className="legend-name">Occupied Beds</div>
              <div className="legend-val">382 (85%)</div>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#e2e8f0' }}></span>
            <div className="legend-text">
              <div className="legend-name">Vacant Beds</div>
              <div className="legend-val">68 (15%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyChart;
