import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const formatTick = (name, isMobile) => {
  if (!name) return '';
  if (isMobile && name.length > 10) {
    return name.substring(0, 9).trim() + '...';
  }
  return name;
};

const RevenueByPGChart = ({ data }) => {
  const chartData = data || [];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Revenue by PG</h3>
      </div>
      <div className="chart-body" style={{ height: '220px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 24, right: 0, left: 0, bottom: 0 }} barSize={isMobile ? 20 : 28}>
            <XAxis 
              dataKey="pg_name" 
              axisLine={false} 
              tickLine={false} 
              interval={0}
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              tickFormatter={(name) => formatTick(name, isMobile)}
            />
            <YAxis type="number" hide />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              formatter={(value) => [value >= 100000 ? `₹${(value/100000).toFixed(2)}L` : `₹${(value/1000).toFixed(0)}K`, 'Revenue']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '8px 12px' }}
              itemStyle={{ color: '#1a56db', fontWeight: 700 }}
              labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]}>
              <LabelList 
                dataKey="revenue" 
                position="top" 
                formatter={(value) => value >= 100000 ? `₹${(value/100000).toFixed(2)}L` : `₹${(value/1000).toFixed(0)}K`} 
                style={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByPGChart;
