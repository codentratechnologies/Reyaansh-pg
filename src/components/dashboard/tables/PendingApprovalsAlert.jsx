import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const getInitials = (name) => {
  if (!name) return 'UN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN')}`;

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
};

const PendingApprovalsAlert = ({ data = [] }) => {
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
                <td>{item.payment_type}</td>
                <td>{formatDate(item.submitted_on)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovalsAlert;
