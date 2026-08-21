import React from 'react';
import { Check } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'UN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN')}`;

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
};

const RecentPaymentsTable = ({ data = [] }) => {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3 className="table-title">Recent Payments</h3>
      </div>
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>PG</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item.payment_id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{getInitials(item.member_name)}</div>
                    <span>{item.member_name}</span>
                  </div>
                </td>
                <td>{item.pg_name}</td>
                <td><strong>{formatCurrency(item.amount)}</strong></td>
                <td>{formatDate(item.date)}</td>
                <td>
                  <span className="status-badge status-green">
                    <Check size={12} strokeWidth={3} /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPaymentsTable;
