import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const OccupancyChart = ({ data }) => {
  const chartData = [
    { name: 'Occupied Beds', value: data?.occupied_beds?.count || 0, color: '#1a56db', percentage: data?.occupied_beds?.percentage || 0 },
    { name: 'Vacant Beds', value: data?.vacant_beds?.count || 0, color: '#e2e8f0', percentage: data?.vacant_beds?.percentage || 0 },
  ];
  
  const total = chartData[0].value + chartData[1].value;
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
                data={chartData}
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
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
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1a56db' }}></span>
            <div className="legend-text">
              <div className="legend-name">Occupied Beds</div>
              <div className="legend-val">{chartData[0].value} ({chartData[0].percentage}%)</div>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#e2e8f0' }}></span>
            <div className="legend-text">
              <div className="legend-name">Vacant Beds</div>
              <div className="legend-val">{chartData[1].value} ({chartData[1].percentage}%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyChart;
