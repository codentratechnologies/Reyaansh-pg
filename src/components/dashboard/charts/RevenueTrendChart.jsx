import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mar', revenue: 2000000 },
  { name: 'Apr', revenue: 2500000 },
  { name: 'May', revenue: 2200000 },
  { name: 'Jun', revenue: 2800000 },
  { name: 'Jul', revenue: 3200000 },
  { name: 'Aug', revenue: 3800000 },
];

const RevenueTrendChart = () => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Rent Collection Trend</h3>
      </div>
      <div className="chart-body" style={{ height: '180px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a56db" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1a56db" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000000}M`} />
            <Tooltip 
              formatter={(value) => [`₹${(value/100000).toFixed(1)} Lakhs`, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#000000' }}
              labelStyle={{ color: '#000000' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#1a56db" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
