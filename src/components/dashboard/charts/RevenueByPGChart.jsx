import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueByPGChart = ({ data }) => {
  const chartData = data || [];
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Revenue by PG</h3>
      </div>
      <div className="chart-body" style={{ height: '180px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: -10 }} barSize={12}>
            <XAxis type="number" hide />
            <YAxis dataKey="pg_name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              formatter={(value) => [value >= 100000 ? `₹${(value/100000).toFixed(2)}L` : `₹${(value/1000).toFixed(0)}K`, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#000000' }}
              labelStyle={{ color: '#000000' }}
            />
            <Bar dataKey="revenue" fill="#1a56db" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByPGChart;
