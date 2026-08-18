import React from 'react';
import { Check } from 'lucide-react';

const recentPayments = [
  { id: 1, initials: 'NV', name: 'Nikhil Verma', pg: 'Sunrise PG', amount: '₹12,000', date: 'Today, 10:21 AM' },
  { id: 2, initials: 'PD', name: 'Priya Das', pg: 'Lotus Villa', amount: '₹15,500', date: 'Today, 09:15 AM' },
  { id: 3, initials: 'AK', name: 'Anil Kapoor', pg: 'Green View', amount: '₹11,000', date: 'Yesterday, 08:45 PM' },
  { id: 4, initials: 'KJ', name: 'Kavita Jain', pg: 'Oasis', amount: '₹14,000', date: 'Jul 31, 2026' },
  { id: 5, initials: 'MY', name: 'Manish Yadav', pg: 'Park View', amount: '₹13,500', date: 'Jul 31, 2026' },
];

const RecentPaymentsTable = () => {
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
            {recentPayments.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{item.initials}</div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.pg}</td>
                <td><strong>{item.amount}</strong></td>
                <td>{item.date}</td>
                <td>
                  <span className="status-badge status-green">
                    <Check size={12} strokeWidth={3} /> Paid
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
