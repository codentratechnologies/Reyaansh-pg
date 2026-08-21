import React from 'react';

const getInitials = (name) => {
  if (!name) return 'UN';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN')}`;

const RentOverdueAlert = ({ data = [] }) => {
  return (
    <div className="table-card" style={{ borderColor: '#fecaca', background: '#fff5f5' }}>
      <div className="table-header">
        <h3 className="table-title" style={{ color: '#dc2626' }}>Alert: Rent Overdue</h3>
      </div>
      <div className="table-container">
        <table className="list-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>PG & Room</th>
              <th>Rent</th>
              <th>Due Date</th>
              <th>Overdue By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item.rent_id}>
                <td>
                  <div className="member-info">
                    <div className="member-avatar">{getInitials(item.member_name)}</div>
                    <span>{item.member_name}</span>
                  </div>
                </td>
                <td>
                  <div className="cell-stack">
                    <span className="cell-primary">{item.pg_name}</span>
                    <span className="cell-secondary">Room {item.room_number}</span>
                  </div>
                </td>
                <td><strong>{formatCurrency(item.rent_amount)}</strong></td>
                <td>{item.due_date}</td>
                <td style={{ color: '#dc2626', fontWeight: 600 }}>{item.overdue_by_days} Days</td>
                <td>
                  <span className={`status-badge status-${item.overdue_by_days > 15 ? 'red' : 'orange'}`}>
                    {item.status}
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

export default RentOverdueAlert;
