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
              <th>PG</th>
              <th>Room</th>
              <th>Rent</th>
              <th>Due Date</th>
              <th>Overdue By</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {!data || data.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b', fontSize: '14px' }}>
                  No overdue rent to display.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.rent_id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">{getInitials(item.member_name)}</div>
                      <span>{item.member_name}</span>
                    </div>
                  </td>
                  <td>{item.pg_name}</td>
                  <td>{item.room_number}</td>
                  <td><strong>{formatCurrency(item.rent_amount)}</strong></td>
                  <td>{item.due_date}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>{item.overdue_by_days} Days</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-${item.overdue_by_days > 15 ? 'red' : 'orange'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentOverdueAlert;
