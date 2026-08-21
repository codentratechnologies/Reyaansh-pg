import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueTrendChart = ({ data }) => {
  const chartData = data || [];
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Rent Collection Trend</h3>
      </div>
      <div className="chart-body" style={{ height: '180px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a56db" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1a56db" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => val >= 1000000 ? `₹${(val / 1000000).toFixed(1)}M` : `₹${(val / 1000).toFixed(0)}K`} />
            <Tooltip 
              formatter={(value) => [value >= 100000 ? `₹${(value/100000).toFixed(2)} Lakhs` : `₹${value}`, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#000000' }}
              labelStyle={{ color: '#000000' }}
            />
            <Area type="monotone" dataKey="amount" stroke="#1a56db" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
