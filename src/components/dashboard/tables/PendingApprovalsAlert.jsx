import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const pendingApprovals = [
  { id: 1, initials: 'NV', name: 'Nikhil Verma', pg: 'Sunrise PG', amount: '₹12,000', date: 'Today, 10:21 AM', type: 'UPI' },
  { id: 2, initials: 'PD', name: 'Priya Das', pg: 'Lotus Villa', amount: '₹15,500', date: 'Today, 09:15 AM', type: 'Bank Transfer' },
  { id: 3, initials: 'AK', name: 'Anil Kapoor', pg: 'Green View', amount: '₹11,000', date: 'Yesterday, 08:45 PM', type: 'UPI' },
  { id: 4, initials: 'KJ', name: 'Kavita Jain', pg: 'Oasis', amount: '₹14,000', date: 'Aug 10, 2026', type: 'Bank Transfer' },
  { id: 5, initials: 'MY', name: 'Manish Yadav', pg: 'Park View', amount: '₹13,500', date: 'Aug 09, 2026', type: 'UPI' },
];

const PendingApprovalsAlert = () => {
  return (
    <div className="table-card" style={{ borderColor: '#fed7aa', background: '#fff7ed' }}>
      <div className="table-header">
        <h3 className="table-title" style={{ color: '#ea580c' }}>Alert: Pending Approvals</h3>
      </div>
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>PG</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{item.initials}</div>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.pg}</td>
                <td><strong>{item.amount}</strong></td>
                <td>{item.type}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovalsAlert;
